import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Modal from 'react-modal';

// Set the app element for the modal
Modal.setAppElement('#root');

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
)