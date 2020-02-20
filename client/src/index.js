import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import RootContainer from './containers/RootContainer'

const store = createStore(reducers, applyMiddleware(thunk));

const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '*::-webkit-scrollbar': {
                width: '0.4em'
                },
                '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid slategrey'
                }
            },
        }
    },
    palette: {
        type: 'dark'
    },
    typography: {
        caption: {
            color: '#86DFA'
        }
    }
})

const render = (Component) => {
    ReactDOM.render(
    <Provider store={store}>
    <MuiThemeProvider theme = {theme}>
        <Component />
    </MuiThemeProvider>    
    </Provider>
    , document.getElementById('root'));
}

render(RootContainer);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
