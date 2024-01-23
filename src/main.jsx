import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './index.css'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root');
const app = React.createElement(App);
const strictMode = React.createElement(React.StrictMode, null, app);
ReactDOM.createRoot(root).render(strictMode);
