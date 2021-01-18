import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseUrl from '../globals';

export const getScoredPreds = createAsyncThunk(
  'scoring/getScoredPreds',
  async ([username, gameweek], { getState }) => new Promise((resolve) => {
    const gameweekReq = gameweek || getState().scoring.selectedGameweek;
    const usernameReq = username || getState().scoring.selectedUser;
    let url;
    if (usernameReq && usernameReq !== 'Mine') {
      url = `${baseUrl}/friendpredictions?username=${usernameReq}&gameweek=${gameweekReq}`;
    } else {
      url = `${baseUrl}/getuserpredictions?gameweek=${gameweekReq}`;
    }

    return fetch(url, { credentials: 'include' }).then((response) => response.json()).then((res) => {
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
        matches: finalGamesArr,
        username: usernameReq,
      });
    });
  }),
);

export const scoringSlice = createSlice({
  name: 'scoring',
  initialState: {
    selectedUser: 'Mine',
    selectedGameweek: 0,
    matches: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: {
    [getScoredPreds.fulfilled]: (state, action) => {
      state.matches = action.payload.matches;
      state.selectedGameweek = action.payload.gameweek;
      state.selectedUser = action.payload.username;
      state.status = 'success';
    },
    [getScoredPreds.pending]: (state) => {
      state.status = 'pending';
    },
  },
});

export const selectScoredMatches = (state) => (
  state.scoring.matches.filter((val) => new Date(val.kick_off_time) < Date.now())
);
export const selectSelectedGameweek = (state) => state.scoring.selectedGameweek;
export const selectScoringStatus = (state) => state.scoring.status;

export default scoringSlice.reducer;
