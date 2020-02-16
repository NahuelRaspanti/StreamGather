import axios from 'axios';

export const fetchUser = () => async dispatch => {
    const response = await axios.get('/api/fetch_current_user',
    {withCredentials: true});
    
    dispatch({ type: 'FETCH_USER', payload: response.data})
}