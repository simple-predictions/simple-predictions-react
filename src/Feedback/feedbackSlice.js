import { createSlice } from '@reduxjs/toolkit';

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    popupOpen: false,
  },
  reducers: {
    openPopup: (state) => { state.popupOpen = true; },
    closePopup: (state) => { state.popupOpen = false; },
  },
});

export const { openPopup, closePopup } = feedbackSlice.actions;

export const selectPopupOpen = (state) => state.feedback.popupOpen;

export default feedbackSlice.reducer;
