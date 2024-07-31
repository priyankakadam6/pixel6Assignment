import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addCustomer, updateCustomer } from './redux/customerSlice';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// Utility functions for validation
const validatePAN = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)|| 'PAN must be in valid format (AAAAA1111A)'; // PAN format validation
const validateMobile = (value) => /^[0-9]{10}$/.test(value); // Mobile number validation

const FormComponent = () => {
  // Hook for managing form state and validation
  const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' });
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // React Router navigate function
  const { id } = useParams(); // Get ID from URL parameters
  const customers = useSelector(state => state.customers.customers); // Get customers from Redux state

  const [panLoading, setPanLoading] = useState(false); // State for PAN verification loading
  const [postcodeLoading, setPostcodeLoading] = useState(false); // State for postcode details loading
  const [states, setStates] = useState([]); // State for storing state options
  const [cities, setCities] = useState([]); // State for storing city options

  // Populate form fields if editing an existing customer
  useEffect(() => {
    if (id) {
      const customer = customers.find(customer => customer.id === parseInt(id));
      if (customer) {
        reset(customer); // Set form values to customer data
      }
    }
  }, [id, customers, reset]);

  // Handle form submission
  const onSubmit = (data) => {
    if (id) {
      dispatch(updateCustomer({ ...data, id: parseInt(id) })); // Update existing customer
    } else {
      dispatch(addCustomer({ ...data, id: Date.now() })); // Add new customer
    }
    navigate('/customers'); // Redirect to customer list page
  };

  // Verify PAN number with API
  const verifyPAN = async (pan) => {
    setPanLoading(true); // Set loading state
    try {
      const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: pan });
      if (response.data.isValid) {
        setValue('fullName', response.data.fullName); // Set full name from API response
      }
    } catch (error) {
      console.error('Error verifying PAN:', error);
    } finally {
      setPanLoading(false); // Reset loading state
    }
  };

  // Fetch postcode details with API
  const fetchPostcodeDetails = async (postcode, index) => {
    setPostcodeLoading(true); // Set loading state
    try {
      const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode });
      const { city, state } = response.data;
      setCities(city); // Set city options from API response
      setStates(state); // Set state options from API response
      setValue(`addresses[${index}].city`, city[0].name); // Set city field
      setValue(`addresses[${index}].state`, state[0].name); // Set state field
    } catch (error) {
      console.error('Error fetching postcode details:', error);
    } finally {
      setPostcodeLoading(false); // Reset loading state
    }
  };

  // Watch for changes in PAN field
  const panWatch = watch('pan');
  // Watch for changes in address fields
  const addressWatch = watch('addresses');

  // Verify PAN when it changes
  useEffect(() => {
    if (panWatch) {
      setValue('pan',panWatch.toUpperCase())
      if(panWatch.length==10){
        verifyPAN(panWatch)}
    }
  }, [panWatch]);

  // Fetch postcode details when postcode changes
  useEffect(() => {
    console.log("addressWatch",addressWatch)
    addressWatch?.forEach((address, index) => {
      if (address && address.postcode && address.postcode.length === 6) {
        fetchPostcodeDetails(address.postcode, index);
      }
    });
  }, [addressWatch]);

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PAN field */}
        <div className="mb-3">
          <label className="form-label">PAN:</label>
          <input
            type="text"
            className={`form-control ${errors.pan ? 'is-invalid' : ''}`}
            {...register('pan', { required: 'PAN is required', maxLength: { value: 10, message: 'PAN must be 10 characters' }, validate: validatePAN })}
          />
          {panLoading && <div className="form-text">Loading...</div>}
          <div className="invalid-feedback">{errors.pan?.message}</div>
        </div>

        {/* Full Name field */}
        <div className="mb-3">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            {...register('fullName', { required: 'Full Name is required', maxLength: { value: 140, message: 'Full Name cannot exceed 140 characters' } })}
          />
          <div className="invalid-feedback">{errors.fullName?.message}</div>
        </div>

        {/* Email field */}
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email', { required: 'Email is required', maxLength: { value: 255, message: 'Email cannot exceed 255 characters' }, pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        {/* Mobile Number field */}
        <div className="mb-3">
          <label className="form-label">Mobile Number:</label>
          <div className="input-group">
            <span className="input-group-text">+91</span>
            <input
              type="text"
              className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
              {...register('mobileNumber', { required: 'Mobile Number is required', maxLength: { value: 10, message: 'Mobile Number must be 10 digits' }, validate: validateMobile })}
            />
             <div className="invalid-feedback">{errors.mobileNumber?.message}</div>
          </div>
        </div>

        {/* Addresses field */}
        <div className="mb-3">
          <label className="form-label">Addresses:</label>
          {fields.map((item, index) => (
            <div key={item.id} className="border p-3 mb-3">
              {/* Address Line 1 field */}
              <div className="mb-3">
                <label className="form-label">Address Line 1:</label>
                <input
                  type="text"
                  className={`form-control ${errors.addresses?.[index]?.line1 ? 'is-invalid' : ''}`}
                  {...register(`addresses.${index}.line1`, { required: 'Address Line 1 is required' })}
                />
                <div className="invalid-feedback">{errors.addresses?.[index]?.line1?.message}</div>
              </div>

              {/* Address Line 2 field */}
              <div className="mb-3">
                <label className="form-label">Address Line 2:</label>
                <input
                  type="text"
                  className="form-control"
                  {...register(`addresses.${index}.line2`)}
                />
              </div>

              {/* Postcode field */}
              <div className="mb-3">
                <label className="form-label">Postcode:</label>
                <input
                  type="text"
                  className={`form-control ${errors.addresses?.[index]?.postcode ? 'is-invalid' : ''}`}
                  {...register(`addresses.${index}.postcode`, { required: 'Postcode is required', maxLength: { value: 6, message: 'Postcode must be 6 digits' }, pattern: { value: /^[0-9]{6}$/, message: 'Invalid postcode format' } })}
                />
                {postcodeLoading && <div className="form-text">Loading...</div>}
                <div className="invalid-feedback">{errors.addresses?.[index]?.postcode?.message}</div>
              </div>

              {/* State field */}
              <div className="mb-3">
                <label className="form-label">State:</label>
                <select
                  className={`form-select ${errors.addresses?.[index]?.state ? 'is-invalid' : ''}`}
                  {...register(`addresses.${index}.state`, { required: 'State is required' })}
                >
                  {states.map(state => (
                    <option key={state.id} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors.addresses?.[index]?.state?.message}</div>
              </div>

              {/* City field */}
              <div className="mb-3">
                <label className="form-label">City:</label>
                <select
                  className={`form-select ${errors.addresses?.[index]?.city ? 'is-invalid' : ''}`}
                  {...register(`addresses.${index}.city`, { required: 'City is required' })}
                >
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors.addresses?.[index]?.city?.message}</div>
              </div>

              <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Remove Address</button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={() => append({})}>Add Address</button>
        </div>

        <button type="submit" className="btn btn-success">{id ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default FormComponent;
