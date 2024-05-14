import React, { createContext, useEffect, useReducer } from "react";

const InitialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        currentUser: action.payload,
      };
    }
    case "LOGOUT": {
      return {
        currentUser: null,
      };
    }
    default:
      return state;
  }
};

export const AuthContext = createContext(InitialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, InitialState);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
