import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const root = document.getElementById("root");
const app = React.createElement(App);
const strictMode = React.createElement(React.StrictMode, null, app);
ReactDOM.createRoot(root).render(strictMode);
