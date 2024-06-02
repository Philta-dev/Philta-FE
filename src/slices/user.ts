import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  preAcc: '',
  preRef: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
    setUser(state, action) {
      state.preAcc = action.payload.preAcc;
      state.preRef = action.payload.preRef;
    },
  },
  extraReducers: builder => {},
});

export const {setToken} = userSlice.actions;
export default userSlice;
