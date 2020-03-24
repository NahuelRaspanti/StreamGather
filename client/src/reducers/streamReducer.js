const initialState = {
    streams: [],
    selectedStreams: [],
    selectedChat: '',
    loadingStreams: false,
    teatherMode: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_STREAMS':
            return {
                ...state,
                streams: action.payload
            };
        case 'SET_MULTI':
            return {
                ...state,
                selectedStreams: [...state.selectedStreams, action.payload]
            }
        case 'SELECT_STREAM':
            return {
                ...state,
                selectedStreams: [...state.selectedStreams, action.payload]
            }
        case 'REMOVE_STREAM':
            return {
                ...state,
                selectedStreams: action.payload
            }
        case 'SELECT_CHAT':
            return {
                ...state,
                selectedChat: action.payload
            }
        case 'LOAD_STREAM':
            return {
                ...state,
                loadingStreams: action.payload
            }
        case 'TEATHER_MODE':
            return {
                ...state,
                teatherMode: !state.teatherMode
            }
        default: 
            return state;
    }
}