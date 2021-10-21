import { useReducer } from "react";

// Action
const SET_COLOR = "SET_COLOR";

// Action Creator
export const setColor = (payload) => ({ type: SET_COLOR, payload });

// State
const INITIAL_STATE = {
  color: "pink",
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_COLOR:
      return {
        color: action.payload,
      };
    default:
      return;
  }
};

const ColorModule = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return { state, dispatch };
};

export default ColorModule;
