import {ACTION_TYPE_NETWORK} from "../Action/ActionType";

const INITIAL_NET_STATUS = {
    hasNetwork: true,
};

export const netReducer = (state = INITIAL_NET_STATUS, action) => {
    const {type, netInfo} = action;
    if (type === ACTION_TYPE_NETWORK) {
        return {
            ...state,
            ...netInfo,
        };
    } else {
        return state;
    }
};