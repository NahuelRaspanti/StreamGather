import { combineReducers } from 'redux';
import userReducer from './userReducer'
import streamReducer from './streamReducer';

export default combineReducers({
    user: userReducer,
    streams: streamReducer
})