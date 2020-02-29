import React from 'react';
import './App.css';
import ButtonList from './Components/ButtonList';
import StreamGrid from './Components/StreamGrid';
import StreamDrawer from './Components/Drawer'
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
    <h1><ButtonList
          user = {this.props.user}
          logout = {this.props.logout}
        ></ButtonList></h1>
    <StreamDrawer 
      streams = {this.props.streams}
    ></StreamDrawer>

    </div>
    
    );
    
  }
}

export default App;
