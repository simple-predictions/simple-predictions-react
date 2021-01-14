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
    friends: [],
    email: ''
  },
  reducers: {
  },
  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      state.username = action.payload.username
      state.email = action.payload.email
      state.friends = action.payload.friends.map(friend => {
        friend.name = friend.username
        delete friend.username
        return friend
      })
      state.loggedIn = true
    },
    [getUserInfo.rejected]: state => {
      state.loggedIn = false
    }
  }
})

export const selectLoggedIn = state => state.user.loggedIn
export const selectFriends = state => [{name: 'Mine'},...state.user.friends]
export const selectUserUsername = state => state.user.username
export const selectUserEmail = state => state.user.email

export default userSlice.reducer