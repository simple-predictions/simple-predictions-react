import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseUrl from '../globals';

export const getMinileaguePreds = createAsyncThunk(
  'minileagues/getMinileaguePreds',
  async (gameweek, { getState }) => new Promise((resolve) => {
    const { _id } = getState().minileagues.all[getState().minileagues.selectedIdx];

    const url = `${baseUrl}/minileaguepredictions?league_id=${_id}&gameweek=${gameweek}`;

    fetch(url, { credentials: 'include' }).then((response) => response.json()).then((data) => {
      resolve({
        preds: data.preds,
        gameweek: data.gameweek,
      });
    });
  }),
);

export const getMinileagues = createAsyncThunk(
  'minileagues/getMinileagues',
  async () => new Promise((resolve) => {
    const url = `${baseUrl}/minileagues`;

    fetch(url, { credentials: 'include' }).then((response) => response.json()).then((data) => {
      const finalLeaguesArr = [];
      for (let i = 0; i < data.length; i += 1) {
        const league = data[i];
        const { members } = league;
        const usernames = [];
        for (let x = 0; x < members.length; x += 1) {
          const member = members[x];
          const { username } = member;
          usernames.push(username);
        }
        const membersStr = usernames.join(', ');
        league.members_str = membersStr;
        finalLeaguesArr.push(league);
      }

      resolve({
        minileagues: finalLeaguesArr,
      });
    });
  }),
);

export const minileaguesSlice = createSlice({
  name: 'minileagues',
  initialState: {
    all: [],
    selectedIdx: 0,
    status: 'idle',
  },
  reducers: {
    updateSelectedIdx: (state, action) => {
      state.selectedIdx = action.payload;
    },
  },
  extraReducers: {
    [getMinileagues.pending]: (state) => {
      state.status = 'pending';
    },
    [getMinileagues.fulfilled]: (state, action) => {
      state.status = 'success';
      state.all = action.payload.minileagues;
    },
    [getMinileaguePreds.pending]: (state) => {
      state.status = 'pending';
    },
    [getMinileaguePreds.fulfilled]: (state, action) => {
      state.status = 'success';
      state.all[state.selectedIdx].table = action.payload;
    },
  },
});

export const selectAllMinileagues = (state) => state.minileagues.all;
export const selectMinileaguesStatus = (state) => state.minileagues.status;
export const selectSelectedMinileague = (state) => (
  state.minileagues.all[state.minileagues.selectedIdx]
);
export const selectSelectedMinileagueRankings = (state) => (
  state.minileagues.all[state.minileagues.selectedIdx].rankings
);
export const selectSelectedMinileaguePreds = (state) => (
  state.minileagues.all[state.minileagues.selectedIdx].table.preds
);
export const selectSelectedMinileagueGameweek = (state) => (
  state.minileagues.all[state.minileagues.selectedIdx].table.gameweek
);

export const { updateSelectedIdx } = minileaguesSlice.actions;

export default minileaguesSlice.reducer;
