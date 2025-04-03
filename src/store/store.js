// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import universityReducer from '../features/university/universitySlice';

export const store = configureStore({
  reducer: {
    university: universityReducer,
  },
});