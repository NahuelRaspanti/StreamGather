const initialState = {
    user: [],
    isProfileLoading: true
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_USER':
            return {
                ...state,
                user: action.payload
            }
        case 'LOAD_USER':
            return {
                ...state,
                isProfileLoading: action.payload
            }
        default: 
            return state;
    }
}