import { createSlice } from '@reduxjs/toolkit';

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    alertMessage: '',
    alertVariant: '',
  },
  reducers: {
    updateAlert: (state, action) => {
      state.alertMessage = action.payload.message;
      state.alertVariant = action.payload.variant || 'success';
    },
    clearAlert: (state) => {
      state.alertMessage = ''
    }
  }
})

export const { updateAlert, clearAlert } = alertsSlice.actions;

export const selectAlertMessage = (state) => state.alerts.alertMessage;
export const selectAlertVariant = (state) => state.alerts.alertVariant;

export default alertsSlice.reducer;