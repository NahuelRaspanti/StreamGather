import React from 'react';
import './App.css';
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
    <StreamDrawer 
      streams = {this.props.streams}
      user = {this.props.user}
      logout = {this.props.logout}
      selectStream = {this.props.selectStream}
      removeStream = {this.props.removeStream}
      selectChat = {this.props.selectChat}
    ></StreamDrawer>

    </div>
    
    );
    
  }
}

export default App;
