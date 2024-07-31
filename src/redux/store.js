import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';

const store = configureStore({
  reducer: {
    customers: customerReducer, // Add customer reducer to store
  },
});

export default store;
