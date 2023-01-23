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
  markers: [],
};

const types = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_TOKEN: "SET_TOKEN",
  SAVE_MARKER: "SAVE_MARKER",
  DELETE_MARKER: "DELETE_MARKER",
};

const setToken = (token) => {
  window.localStorage.setItem("authToken", token);
};

const clearStorage = () => {
  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("markers");
};

const reducer = (state, action) => {
  // console.log("LoginContext reducer -- action:", action);
  switch (action.type) {
    case types.LOGIN: {
      const { authToken, userProfile, markers } = action.payload;
      setToken(authToken);
      return {
        ...state,
        loggedIn: true,
        authToken,
        userProfile,
        markers,
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
    case types.SAVE_MARKER: {
      const { markers } = action.payload;
      return {
        ...state,
        ...markers,
      };
    }
    case types.DELETE_MARKER: {
      const { email, marker } = action.payload;
      const selectedUser = state.filter(
        (user) => user.userProfile.email === email
      );
      const modifiedUser = selectedUser.markers.filter((m) => m !== marker);
      return {
        ...state,
        modifiedUser,
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
