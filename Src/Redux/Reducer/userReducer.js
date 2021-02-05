import {ACTION_TYPE_USER_INFO} from "../Action/ActionType";

const INIT_USER_INFO_STATE = {
    userName: '',
    password: '',
    userId: null,
};

export const userReducer = (state = INIT_USER_INFO_STATE, action) => {
    const {type, userInfo} = action;
    if (type === ACTION_TYPE_USER_INFO) {
        return {
            ...state,
            ...userInfo,
        };
    } else {
        return state;
    }
};
