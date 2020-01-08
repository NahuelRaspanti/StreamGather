import React from 'react';
import logo from './logo.svg';
import './App.css';
import ButtonList from './Components/ButtonList';

class App extends React.Component {
  render() {
    return (
    <div className="App">
    <h2>Stream Gather</h2>
    <h1><ButtonList></ButtonList></h1>
    </div>
    
    );
    
  }
}

export default App;
