import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  preAcc: '',
  preRef: '',
  version: '',
  testament: -1,
  book: -1,
  chapter: -1,
  verse: -1,
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
    setIndex(state, action) {
      state.testament = action.payload.testament;
      state.book = action.payload.book;
      state.chapter = action.payload.chapter;
      state.verse = action.payload.verse;
    },
    setTestament(state, action) {
      state.testament = action.payload.testament;
    },
    setBook(state, action) {
      state.book = action.payload.book;
    },
    setChapter(state, action) {
      state.chapter = action.payload.chapter;
    },
    setVerse(state, action) {
      state.verse = action.payload.verse;
    },
    setVersion(state, action) {
      state.version = action.payload.version;
    },
  },
  extraReducers: builder => {},
});

export const {setToken} = userSlice.actions;
export default userSlice;
