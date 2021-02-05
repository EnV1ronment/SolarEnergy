import {combineReducers} from 'redux';
import {userReducer} from './userReducer';
import {netReducer} from './netReducer';


const rootReducer = combineReducers({
    userReducer,
    netReducer,
});

export default rootReducer;
