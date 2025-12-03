import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/auth-slice';
import evaluationsReducer from '../features/evaluations/store/evaluations-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    evaluations: evaluationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

