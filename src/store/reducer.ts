import {combineReducers} from 'redux';

import userSlice from '../slices/user';
import paymentSlice from '../slices/payments';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  payments: paymentSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
