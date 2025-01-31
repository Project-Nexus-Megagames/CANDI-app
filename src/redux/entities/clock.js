import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { apiCallBegan } from "../api"; // Import Redux API call
import { gameServer } from "../../config";

// Create entity slice of the store
const slice = createSlice({
  name: "clock",
  initialState: {
    loading: false,
    lastFetch: null,
    gametime: null,
		nextTick: null,
		tickNum: null,
		paused: true,
    curentTime: {minutes: 9, seconds: 9}
  },
  // Reducers - Events
  reducers: {
    clockRequested: (clock, action) => {
      console.log(`${action.type} Dispatched...`)
      clock.loading = true;
    },
    clockReceived: (clock, action) => {
      console.log(`${action.type} Dispatched...`);
			clock.paused = action.payload.paused;
			clock.gametime = action.payload.gametime;
			clock.nextTick = action.payload.nextTick;
			clock.tickNum = action.payload.tickNum;
			clock.curentTime = action.payload.curentTime;
      

      clock.loading = false;
      clock.lastFetch = Date.now();
    },
    clockRequestFailed: (clock, action) => {
      console.log(`${action.type} Dispatched`)
      clock.loading = false;
    },
    clockAdded: (clock, action) => {
      console.log(`${action.type} Dispatched`)
      clock.list.push(action.payload);
    },
		clockUpdated: (clock, action) => {
      console.log(`${action.type} Dispatched...`);

			const { deadline, hours, minutes, seconds, phase, turn, turnNum, year, gameClock, paused } = action.payload;
			clock.deadline = deadline;
			clock.gameClock = { hours, minutes, seconds }
			clock.time = gameClock;
			clock.paused = paused;
			clock.info = { phase, turn, turnNum, year };

			clock.loading = false;
      clock.lastFetch = Date.now();
    },
		clockDeleted: (clock, action) => {
      console.log(`${action.type} Dispatched`)
      const index = clock.list.findIndex(el => el._id === action.payload._id);
      clock.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  clockAdded,
	clockUpdated,
  clockReceived,
	clockDeleted,
  clockRequested,
  clockRequestFailed
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/clock`;

// clock Loader into state
export const loadClock = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      onStart:clockRequested.type,
      onSuccess:clockReceived.type,
      onError:clockRequestFailed.type
    })
  );
};
