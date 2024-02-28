import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./Styles/app.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
export const success = new Audio("./assets/success.mp3");
export const server = import.meta.env.VITE_SERVER;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
