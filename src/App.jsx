import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Messenger from "./pages/messenger/Messenger.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/Signup.jsx";

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequiredAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/auth/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequiredAuth>
              <Messenger />
            </RequiredAuth>
          }
        />
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
