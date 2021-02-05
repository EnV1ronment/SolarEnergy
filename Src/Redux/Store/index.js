import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../Reducer';
import thunk from 'redux-thunk';

const thunkMiddleware = applyMiddleware(thunk);

const store = createStore(
    rootReducer,
    thunkMiddleware,
);

export default store;
