import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [], // Initial state for customers
  },
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload); // Add new customer to state
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload; // Update existing customer
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload); // Delete customer from state
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customerSlice.actions;

export default customerSlice.reducer;
