import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseUrl from '../globals';

export const getPredictions = createAsyncThunk(
  'predictions/getPredictions',
  async (gameweek) => new Promise((resolve) => {
    let url = `${baseUrl}/getuserpredictions`;
    if (gameweek) {
      url += `?gameweek=${gameweek}`;
    }

    fetch(url, { credentials: 'include' }).then((response) => response.json()).then((res) => {
      const gameweekNum = res.gameweek;
      const { data } = res;
      const finalGamesArr = [];
      for (let i = 0; i < data.length; i += 1) {
        const game = data[i];
        if (game.user_predictions.length === 0) {
          game.user_predictions.push({ home_pred: '-', away_pred: '-' });
        }
        if (new Date(game.kick_off_time).getTime() < Date.now()) {
          game.locked = true;
        } else {
          game.locked = false;
        }
        game.kick_off_time = new Date(game.kick_off_time).toISOString();
        finalGamesArr.push(game);
      }

      resolve({
        gameweek: gameweekNum,
        userPredictions: finalGamesArr,
      });
    });
  }),
);

export const predictionsSlice = createSlice({
  name: 'predictions',
  initialState: {
    gameweek: 0,
    userPredictions: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: {
    [getPredictions.fulfilled]: (state, action) => {
      state.gameweek = action.payload.gameweek;
      state.userPredictions = action.payload.userPredictions;
      state.status = 'success';
    },
    [getPredictions.pending]: (state) => { state.status = 'pending'; },
  },
});

export const selectUserPredictions = (state) => state.predictions.userPredictions;
export const selectUserPredictionsGameweek = (state) => state.predictions.gameweek;
export const selectUserPredictionsStatus = (state) => state.predictions.status;

export default predictionsSlice.reducer;
