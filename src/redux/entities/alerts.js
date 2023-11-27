import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { apiCallBegan } from "../api"; // Import Redux API call
import { createSelector } from 'reselect'
import { gameServer } from "../../config";

// Create entity slice of the store
const slice = createSlice({
  name: "alerts",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    newalerts: 0
  },
  // Reducers - Events
  reducers: {
    alertsRequested: (alerts, action) => {
      console.log(`${action.type} Dispatched...`);
      alerts.loading = true;
    },
    alertsReceived: (alerts, action) => {
      console.log(`${action.type} Dispatched...`);
      alerts.list = action.payload;
      alerts.loading = false;
      alerts.lastFetch = Date.now();
      alerts.loading = true;
    },
    alertsRequestFailed: (alerts, action) => {
      console.log(`${action.type} Dispatched`)
      alerts.loading = false;
    },
    alertAdded: (alerts, action) => {
      console.log(`${action.type} Dispatched`)
      alerts.list.push(action.payload);
    },
    alertUpdated: (alerts, action) => {
      console.log(`${action.type} Dispatched`)
      const index = alerts.list.findIndex(el => el._id === action.payload._id);
			alerts.list[index] = action.payload;
      alerts.lastFetch = Date.now();
    },
		alertDeleted: (alerts, action) => {
      console.log(`${action.type} Dispatched`)
      const index = alerts.list.findIndex(el => el._id === action.payload._id);
      alerts.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  alertAdded,
  alertUpdated,
	alertDeleted,
  alertsReceived,
  alertsRequested,
  alertsRequestFailed
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/alerts`;

// alert Loader into state
// export const loadalerts = () => (dispatch, getState) => {
//   return dispatch(
//     apiCallBegan({
//       url,
//       method: 'get',
//       onStart:alertsRequested.type,
//       onSuccess:alertsReceived.type,
//       onError:alertsRequestFailed.type
//     })
//   );
// };

// Selectors

