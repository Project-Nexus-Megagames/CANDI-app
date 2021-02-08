import axios from "axios";
import * as actions from "../api";

const api = ({ dispatch }) => next => async action => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const { url, method, data, onStart, onSuccess, onError } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);

  try {
    const response = await axios.request({
      url,
      method,
      data
    });
    // General
    dispatch(actions.apiCallSuccess(response.data));
    // Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // General

    if (!error.response) {
    console.log(error);
    }
    else {
    console.log(error);      
     dispatch(actions.apiCallFailed(error.response.data ? error.response.data : error.message));      
    }

    // Specific
    if (onError) dispatch({ type: onError, payload: error.response ? error.response.data : error.message });
  }
};

export default api;
