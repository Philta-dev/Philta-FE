import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  needToPay: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setNeedToPay(state, action) {
      state.needToPay = action.payload.needToPay;
    },
  },
  extraReducers: builder => {},
});

// export const {setToken} = userSlice.actions;
export default paymentSlice;
