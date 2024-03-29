import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "characters",
  initialState: {
    list: [],
    loading: false,
    loaded: false,
    selected: false,
    lastFetch: null,
    failedAttempts: 0,
  },
  // Reducers - Events
  reducers: {
    charactersRequested: (characters, action) => {
      console.log(`${action.type} Dispatched...`);
      characters.loading = true;
    },
    charactersReceived: (characters, action) => {
      console.log(`${action.type} Dispatched...`);
      characters.list = action.payload;
      characters.loading = false;
      characters.lastFetch = Date.now();
      characters.loaded = true;
    },
    charactersRequestFailed: (characters, action) => {
      console.log(`${action.type} Dispatched`);
      characters.failedAttempts++;
      characters.loading = false;
    },
    characterAdded: (characters, action) => {
      console.log(`${action.type} Dispatched`);
      characters.list.push(action.payload);
    },
    characterDeleted: (characters, action) => {
      console.log(`${action.type} Dispatched`);
      const index = characters.list.findIndex((el) => el._id === action.payload._id);
      characters.list.splice(index, 1);
    },
    characterUpdated: (characters, action) => {
      console.log(`${action.type} Dispatched`);
      const index = characters.list.findIndex((el) => el._id === action.payload._id);
      characters.list[index] = action.payload;
      characters.loading = false;
    },
    characterSelected: (characters, action) => {
      console.log(`${action.type} Dispatched`);
      characters.selected = action.payload;
    },
    characterSubLocationUpdated: (characters, action) => {
			console.log(`${action.type} Dispatched`);
			const index = characters.list.findIndex((el) => el._id === action.payload._id);
      console.log(characters.list[index].subLocation)
			if (index > -1) characters.list[index].subLocation = action.payload.subLocation;
		},
  },
});

// Action Export
export const { characterSubLocationUpdated, characterAdded, characterDeleted, charactersReceived, charactersRequested, charactersRequestFailed, characterUpdated, characterSelected } = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/characters`;

// Selector
// export const getMyCharacter = createSelector(
//   (state) => state.characters.list,
//   (state) => state.auth.myCharacter,
//   (state) => state.auth.user,
//   (characters, character, user) => {
//     if (character) return character;
//     return characters.find((char) => char.username === user.username);
//   }
// );

export const getMyCharacter = createSelector(
  (state) => state.characters.list,
  (state) => state.auth.user,
  (characters, user) => {
    return characters.find((char) => char.username.toLowerCase() === user?.username.toLowerCase()) || {};
  }
);

export const getPlayerCharacters = createSelector(
  (state) => state.characters.list,
  (characters) => characters.filter((char) => char.tags.some((el) => el.toLowerCase() === "pc") && char.tags.some((el) => el.toLowerCase() === "public"))
);

export const getPublicPlayerCharacters = createSelector(
  (state) => state.characters.list,
  (characters) => characters.filter((char) => char.tags.some((el) => el.toLowerCase() === "pc"))
);

export const getNonPlayerCharacters = createSelector(
  (state) => state.characters.list,
  (characters) => characters.filter((char) => char.tags.some((el) => el.toLowerCase() === "npc"))
);

export const getControl = createSelector(
  (state) => state.characters.list,
  (characters) => characters.filter((char) => char.tags.some((el) => el === "Control") || char.tags.some((el) => el === "control"))
);

export const getPublicCharacters = createSelector(
  (state) => state.characters.list,
  (characters) => characters.filter((char) => char.tags.some((el) => el.toLowerCase() === "public"))
);

export const getPrivateCharacters = createSelector(
  (state) => state.characters.list,
  (characters) => characters.filter((char) => !char.tags.some((el) => el.toLowerCase() === "public"))
);

export const getPlayersPresent = createSelector(
	(state) => state.characters.list,
	(state) => state.auth.character,
	(characters, myCharacter) => characters.filter((char) => char.location?._id === myCharacter.location?._id)
);

export const getCharacterById = (charId) =>
  createSelector(
    (state) => state.characters,
    (characters) => characters.list.find((char) => char._id === charId)
  );

export const getMyUnlockedCharacters = createSelector(
  (state) => state.characters.list,
  (state) => state.auth.myCharacter,
  (characters, character) => {
    if (!character) return [];
    return characters.filter((char) => character.knownContacts.some((el) => el._id === char._id || el === char._id));
  }
);

export const getUnlockedCharacters = (character) =>
  createSelector(
    (state) => state.characters,
    (characters) => {
      if (!character) return [];
      return characters.list.filter((char) => character.knownContacts.some((el) => el._id === char._id));
    }
  );

// characters Loader into state
export const loadCharacters = (payload) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url,
      method: "get",
      data: payload,
      onStart: charactersRequested.type,
      onSuccess: charactersReceived.type,
      onError: charactersRequestFailed.type,
    })
  );
};
