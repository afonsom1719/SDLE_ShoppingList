import logo from './logo.svg';
import cart from './cart.svg';
import {ReactComponent as CartLogo} from './cart.svg';
import './appLogo.css'
import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CartLogo className="App-logo" fill="none" stroke="white"/>
        <p>
          Enter shopping list ID and hit the button
        </p>
        <Button variant="contained">
            Edit
        </Button>
      </header>
    </div>
  );
}

export default App;
