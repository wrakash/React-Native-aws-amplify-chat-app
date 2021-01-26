import {combineReducers} from 'redux'
import groupReducer from './addGroup/groupReducer';
import msgReducer from './countMsg/msgReducer';

const rootReducer = combineReducers({
    groupReducer,
    msgReducer
})

export default rootReducer