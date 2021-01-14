import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import base_url from '../globals'

export const getScoredPreds = createAsyncThunk(
  'scoring/getScoredPreds',
  async ([username, gameweek]) => await new Promise(resolve => {
    if (username) {
      var url = base_url+'/friendpredictions?username='+username
      if (gameweek) {
        url += '&gameweek='+gameweek
      }
    } else {
      url = base_url+'/getuserpredictions'
      if (gameweek) {
        url += '?gameweek='+gameweek
      }
    }

    return fetch(url, {credentials: "include"}).then(response => response.json()).then((data) => {
      var gameweek_num = data.gameweek
      data = data.data
      var final_games_arr = []
      for (var i = 0; i < data.length; i++) {
        var game = data[i]
        if (game['user_predictions'].length === 0) {
          game['user_predictions'].push({home_pred: '-', away_pred: '-'})
        }
        if (new Date(game['kick_off_time']).getTime() < Date.now()) {
          game['locked'] = true
        } else {
          game['locked'] = false
        }
        game['kick_off_time'] = new Date(game['kick_off_time']).toISOString()
        final_games_arr.push(game)
      }  

      resolve({
        gameweek: gameweek_num,
        matches: final_games_arr,
        username: username
      })
    })
  })
)

export const scoringSlice = createSlice({
  name: 'scoring',
  initialState: {
    selectedUser: 'Mine',
    selectedGameweek: 0,
    matches: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: {
    [getScoredPreds.fulfilled]: (state, action) => {
      state.matches = action.payload.matches
      state.selectedGameweek = action.payload.gameweek
      state.selectedUsername = action.payload.username
      state.status = 'success'
    },
    [getScoredPreds.pending]: state => {
      state.status = 'pending'
    }
  }
})

export const selectScoredMatches = state => {
  return state.scoring.matches.filter((val) => new Date(val.kick_off_time) < Date.now())
}

export const selectSelectedGameweek = state => state.scoring.selectedGameweek
export const selectScoringStatus = state => state.scoring.status

export default scoringSlice.reducer