import React from 'react';
import './App.css';
import ButtonList from './Components/ButtonList';
import StreamGrid from './Components/StreamGrid';
import { CssBaseline } from '@material-ui/core';

class App extends React.Component {

  async componentDidMount() {
    await this.props.fetchUser();
    await this.props.fetchStreams();
  }

  render() {
    return (
    <div className="App">
    <CssBaseline/>
    <h2>Stream Gather</h2>
    <h1><ButtonList></ButtonList></h1>
      <div>
        <StreamGrid
          user = {this.props.user}
          streams = {this.props.streams}
        ></StreamGrid>
      </div>
    </div>
    
    );
    
  }
}

export default App;
