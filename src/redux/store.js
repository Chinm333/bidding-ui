import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import bidReducer from './reducers/bidReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    bids: bidReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
