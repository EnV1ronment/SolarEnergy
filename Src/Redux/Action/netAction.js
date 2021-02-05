import {ACTION_TYPE_NETWORK} from "./ActionType";

/**
 * Monitor network status
 * @param netInfo : {
 *     hasNetwork: true,
 * }
 * @returns {{netInfo: *, type: *}}
 */
export const netAction = netInfo => ({
    type: ACTION_TYPE_NETWORK,
    netInfo,
});