import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './setting/reducers';
export const store1 = configureStore({
  reducer: {
    setting: settingReducer
  }
});
