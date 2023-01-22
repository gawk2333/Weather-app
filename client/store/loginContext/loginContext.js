import React, { createContext, useReducer } from "react";

const State = createContext();
const Dispatch = createContext();

const initialState = {
  loggedIn: false,
  authToken: null,
  userProfile: {
    firstName: "",
    lastName: "",
    email: "",
  },
};

const types = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_TOKEN: "SET_TOKEN",
};

const clearStorage = () => {
  window.localStorage.removeItem("authToken");
};

const reducer = (state, action) => {
  // console.log('LoginContext reducer -- action:', action);
  switch (action.type) {
    case types.LOGIN: {
      const { authToken, userProfile } = action.payload;
      return {
        ...state,
        loggedIn: true,
        authToken,
        userProfile,
      };
    }
    case types.LOGOUT: {
      clearStorage();
      return {
        ...initialState,
      };
    }
    case types.SET_TOKEN: {
      const { authToken } = action;
      return {
        ...state,
        authToken,
      };
    }
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </State.Provider>
  );
};

export const LoginContext = {
  State,
  Dispatch,
  Provider,
  types,
};
