import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  needToPay: true,
  payModal: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setNeedToPay(state, action) {
      state.needToPay = action.payload.needToPay;
    },
    setPayModal(state, action) {
      state.payModal = action.payload.payModal;
    },
  },
  extraReducers: builder => {},
});

// export const {setToken} = userSlice.actions;
export default paymentSlice;
