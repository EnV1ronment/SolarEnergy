import {ACTION_TYPE_USER_INFO} from "./ActionType";

/**
 * User info
 * @param userInfo : {
 *     userName: '13900001111',
 *     password: '#sfk82#kfkkkksaloeiroqurn',
 *     userId: 11111,
 * }
 * @returns {{userInfo: *, type: string}}
 */
export const userAction = userInfo => ({
    type: ACTION_TYPE_USER_INFO,
    userInfo,
});
