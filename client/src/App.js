import React from 'react';
import logo from './logo.svg';
import './App.css';
import ButtonList from './Components/ButtonList';
import StreamGrid from './Components/StreamGrid';
import { CssBaseline } from '@material-ui/core';

class App extends React.Component {
  render() {
    return (
    <div className="App">
    <CssBaseline/>
    <h2>Stream Gather</h2>
    <h1><ButtonList></ButtonList></h1>
      <div>
        <StreamGrid></StreamGrid>
      </div>
    </div>
    
    );
    
  }
}

export default App;
