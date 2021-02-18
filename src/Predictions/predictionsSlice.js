import { createSlice } from '@reduxjs/toolkit';

export const predictionsSlice = createSlice({
  name: 'predictions',
  initialState: {
    gameweek: 0,
    userPredictions: [],
    status: 'idle',
  },
  reducers: {
    setPredictionsGameweek: (state, action) => { state.gameweek = action.payload; },
  },
});

export const selectUserPredictions = (state) => state.predictions.userPredictions;
export const selectUserPredictionsGameweek = (state) => state.predictions.gameweek;
export const selectUserPredictionsStatus = (state) => state.predictions.status;

export const { setPredictionsGameweek } = predictionsSlice.actions;

export default predictionsSlice.reducer;
