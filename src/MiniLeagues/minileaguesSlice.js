import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import base_url from '../globals'

export const getMinileaguePreds = createAsyncThunk(
  'minileagues/getMinileaguePreds',
  async (gameweek, {getState}) => await new Promise(resolve => {
    const {_id} = getState().minileagues.all[getState().minileagues.selectedIdx]

    var url = base_url+'/minileaguepredictions?league_id='+_id+'&gameweek='+gameweek

    fetch(url, {credentials: "include"}).then(response => response.json()).then((data) => {
      resolve({
        preds: data['preds'],
        gameweek: data['gameweek']
      })
    })
  })
)

export const getMinileagues = createAsyncThunk(
  'minileagues/getMinileagues',
  async () => await new Promise(resolve => {
    var url = base_url+'/minileagues'

    fetch(url, {credentials: "include"}).then(response => response.json()).then((data) => {
      var final_leagues_arr = []
      for (var i = 0; i < data.length; i++) {
        var league = data[i]
        var members = league['members']
        var usernames = []
        for (var x = 0; x < members.length; x++) {
          var member = members[x]
          var username = member['username']
          usernames.push(username)
        }
        var members_str = usernames.join(', ')
        league['members_str'] = members_str
        final_leagues_arr.push(league)
      }

      resolve({
        minileagues: final_leagues_arr
      })
    })
  })
)

export const minileaguesSlice = createSlice({
  name: 'minileagues',
  initialState: {
    all: [],
    selectedIdx: 0,
    status: 'idle'
  },
  reducers: {
    updateSelectedIdx: (state, action) => {
      state.selectedIdx = action.payload
    }
  },
  extraReducers: {
    [getMinileagues.pending]: state => {
      state.status = 'pending'
    },
    [getMinileagues.fulfilled]: (state, action) => {
      state.status = 'success'
      state.all = action.payload.minileagues
    },
    [getMinileaguePreds.pending]: state => {
      state.status = 'pending'
    },
    [getMinileaguePreds.fulfilled]: (state, action) => {
      console.log(action.payload)
      console.log(state.selectedIdx)
      state.status = 'success'
      state.all[state.selectedIdx].table = action.payload
    }
  }
})

export const selectAllMinileagues = state => state.minileagues.all
export const selectMinileaguesStatus = state => state.minileagues.status
export const selectSelectedMinileague = state => state.minileagues.all[state.minileagues.selectedIdx]
export const selectSelectedMinileagueRankings = state => state.minileagues.all[state.minileagues.selectedIdx].rankings
export const selectSelectedMinileaguePreds = state => state.minileagues.all[state.minileagues.selectedIdx].table.preds
export const selectSelectedMinileagueGameweek = state => state.minileagues.all[state.minileagues.selectedIdx].table.gameweek

export const { updateSelectedIdx } = minileaguesSlice.actions

export default minileaguesSlice.reducer