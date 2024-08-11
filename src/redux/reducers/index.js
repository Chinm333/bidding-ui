import { combineReducers } from 'redux';
import authReducer from './authReducer';
import bidReducer from './bidReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    bids: bidReducer,
});

export default rootReducer;
