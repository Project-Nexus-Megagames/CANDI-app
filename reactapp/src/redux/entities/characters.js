import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "characters",
	initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    newcharacters: 0
  },
  // Reducers - Events
  reducers: {
    charactersRequested: (characters, action) => {
      console.log(`${action.type} Dispatched...`)
      characters.loading = true;
    },
    charactersReceived: (characters, action) => {
      console.log(`${action.type} Dispatched...`);
      characters.list = action.payload;
      characters.loading = false;
      characters.lastFetch = Date.now();
    },
    charactersRequestFailed: (characters, action) => {
      console.log(`${action.type} Dispatched`)
      characters.loading = false;
    },
    characterAdded: (characters, action) => {
      console.log(`${action.type} Dispatched`)
      characters.list.push(action.payload);
    },
    characterUpdated: (characters, action) => {
      console.log(`${action.type} Dispatched`)
      const index = characters.list.findIndex(el => el._id === action.payload._id);
      characters.list[index] = action.payload;
    }
  }
});

// Action Export
export const {
  characterAdded,
  charactersReceived,
  charactersRequested,
  charactersRequestFailed,
  characterUpdated
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/characters`;

// Selector
export const getMyCharacter = createSelector(
  state => state.characters.list,
  state => state.auth.user,
  (characters, user) => characters.find(
    char => char.username === user.username
  )
);

// characters Loader into state
export const loadCharacters = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:charactersRequested.type,
      onSuccess: charactersReceived.type,
      onError:charactersRequestFailed.type
    })
  );
};