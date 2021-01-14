import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import base_url from '../globals'

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async () => await new Promise((resolve, reject) => {
    fetch(base_url+'/userinfo', {credentials: 'include'}).then(res => {
      if (res.status === 200) {
        res.json().then(data => resolve(data))
      } else {
        reject('Unsuccessful')
      }
    })
  })
)

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    loggedIn: false,
    friends: []
  },
  reducers: {
  },
  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      state.username = action.payload.username
      state.friends = action.payload.friends
      state.loggedIn = true
    },
    [getUserInfo.rejected]: state => {
      state.loggedIn = false
    }
  }
})

export const selectLoggedIn = state => state.user.loggedIn

export default userSlice.reducer