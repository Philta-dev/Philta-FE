import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './reducer';

const store = configureStore({
  reducer: rootReducer,
  // middleware: getDefaultMiddleware => {
  //   if (__DEV__) {
  //     return getDefaultMiddleware().concat(
  //       require('redux-logger').createLogger(),
  //     );
  //   }
  //   return getDefaultMiddleware();
  // },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
