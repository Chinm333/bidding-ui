const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                error: null,
            };
        case 'LOGIN_FAIL':
        case 'REGISTER_FAIL':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
