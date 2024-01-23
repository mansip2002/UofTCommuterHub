import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './index.css'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root');
const hello = React.createElement('div', null, 'Hello!');
ReactDOM.createRoot(root).render(hello);
