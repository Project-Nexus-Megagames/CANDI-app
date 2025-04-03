import { createSlice } from '@reduxjs/toolkit'; // Import from reactjs toolkit
import { apiCallBegan } from '../api'; // Import Redux API call
// import playTrack from "../../scripts/audio";
import jwtDecode from 'jwt-decode'; // JSON web-token decoder

// Create entity slice of the store
const slice = createSlice({
  name: 'auth',
  initialState: {
    user: undefined,
    myCharacter: undefined,
    login: false,
    loading: false,
    control: false,
    lastFetch: false,
    users: [],
    error: null,

    loadingStart: false,
    loadComplete: false,
    lastLogin: null,

    character: undefined,
    team: false,
  },
  // Reducers - Events
  reducers: {
    // this will become hadleLogin from app.js
    loginRequested: (auth, action) => {
      console.log(`${action.type} Dispatched...`);
      auth.loading = true;
    },
    loadingState: (auth, action) => {
      console.log(`${action.type} Dispatched...`);
      auth.loadingStart = true;      
    },
    authReceived: (auth, action) => {
      console.log(`${action.type} Dispatched...`);

      let jwt = action.payload.token;
      
      console.log("jwt:")
      console.log(jwt)

      localStorage.setItem('draft-token', jwt);
      const user = jwtDecode(jwt);
    
      // if (user?.roles.some(el => el === "Control")) auth.control = true;

      auth.error = null;
      auth.user = user;
      auth.lastFetch = Date.now();
      auth.loading = false;
      auth.login = true;
    },
    authRequestFailed: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.loading = false;
      auth.error = action.payload;
    },
    loginSocket: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.socket = action.payload.me;
    },
    finishLoading: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.loadComplete = true;
    },
    setTeam: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.team = action.payload;
      // initConnection(auth.user, auth.team, auth.version);
      
      if (action.payload?.name === 'Control Team') auth.control = true;
    },
    setCharacter: (auth, action) => {
      console.log(`${action.type} Dispatched`);

      if (!action.payload) {
        console.log("CHARACTER IS UNDEFINED");
        return;
      }

      auth.myCharacter = action.payload;
      auth.character = action.payload;
      if (action.payload.tags.some((el) => el.toLowerCase() === 'control')) auth.control = true;
      // initConnection(auth.user, auth.team, auth.version);
    },
    setControl: (auth, action) => {
      auth.control = action.payload.control;
    },
    clearAuthError: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.error = null;
    },
    signOut: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      localStorage.removeItem('draft-token');
      auth.user = null;
      auth.login = false;
      auth.loading = false;
      auth.lastFetch = null;
      auth.myCharacter = false;
      auth.character = false;
      auth.error = null;
    },
    usersRecieved: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.users = action.payload;
    },
    updateUser: (auth, action) => {
      console.log(`${action.type} Dispatched`);
      auth.user = action.payload.user;
    },
  },
});

// Action Export
export const { authReceived, loginRequested, authRequestFailed, loginSocket, clearAuthError, signOut, updateUser, usersRecieved, finishLoading, setCharacter, setControl, setTeam, loadingState } = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = 'https://nexus-server.onrender.com/auth';

// aircraft Loader into state
export const loginUser = (payload) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'post',
      data: payload,
      onStart: loginRequested.type,
      onSuccess: authReceived.type,
      onError: authRequestFailed.type,
    })
  );
};
