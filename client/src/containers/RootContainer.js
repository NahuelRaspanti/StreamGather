import React from 'react';
import App from '../App'
import { fetchUser, fetchStreams, logout } from '../actions'
import { connect } from 'react-redux';

const RootContainer = props => <App {...props}/>;

const mapStateToProps = state => {
  return { 
    user: state.user,
    streams: state.streams
  }
}
  
export default connect(mapStateToProps, 
  { fetchUser, fetchStreams, logout }
)(RootContainer);
