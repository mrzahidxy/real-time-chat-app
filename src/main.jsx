import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { ChatContextProvider } from "./context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatContextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChatContextProvider>
  </React.StrictMode>
);
