import axios from "axios";
import * as CONSTANT from '../../constant/constant.js';

export const login = (email, password) => async dispatch => {
    try {
        const response = await axios.post(CONSTANT.API_BASE_URL + '/api/auth/login', { email, password });
        const { access_token, user } = response.data;
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log(response);
        
        return response;
    } catch (error) {
        dispatch({ type: 'LOGIN_FAIL', payload: error.response.data });
    }
};
export const register = (user) => async dispatch => {
    try {
        const response = await axios.post(CONSTANT.API_BASE_URL + '/api/user/register', user);
        dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
        localStorage.setItem('token', response.data.access_token); 
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        return response;
    } catch (error) {
        dispatch({ type: 'REGISTER_FAIL', payload: error.response.data });
    }
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    console.log('currentUser', user); 
    
    return user ? JSON.parse(user) : null;
};