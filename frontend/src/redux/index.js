import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    theme: themeReducer,
    notification: notificationReducer,
    loading: loadingReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
