import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import LogRocket from 'logrocket';
import baseUrl from '../globals';

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async () => new Promise((resolve, reject) => {
    fetch(`${baseUrl}/userinfo`, { credentials: 'include' }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => resolve(data));
      } else {
        reject(new Error('Unsuccessful'));
      }
    });
  }),
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    loggedIn: false,
    friends: [],
    email: '',
  },
  reducers: {
  },
  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      // eslint-disable-next-line no-underscore-dangle
      LogRocket.identify(action.payload._id, {
        name: action.payload.username,
        email: action.payload.email,
      });
      state.totalPoints = action.payload.totalPoints;
      state.friends = action.payload.friends.map((friend) => {
        const friendCopy = friend;
        friendCopy.name = friendCopy.username;
        delete friendCopy.username;
        return friendCopy;
      });
      state.loggedIn = true;
    },
    [getUserInfo.rejected]: (state) => {
      state.loggedIn = false;
    },
  },
});

export const selectLoggedIn = (state) => state.user.loggedIn;
export const selectFriends = (state) => [{ name: 'Mine' }, ...state.user.friends];
export const selectUserUsername = (state) => state.user.username;
export const selectUserEmail = (state) => state.user.email;
export const selectUserTotalPoints = (state) => state.user.totalPoints;

export default userSlice.reducer;
