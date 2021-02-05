import axios from 'axios';
import {online, debug, release} from '../../app';
import GetSuffix from "./GetSuffix";
import SystemModel from "../Model/SystemModel";
import {DeviceEventEmitter} from "react-native";

const timeout = 10000;

export default function (path, params, method = METHOD.GET) {

    method = method.toUpperCase();

    // Object is reference type, so copied as a backup in case of changing outside.
    let data = null;
    if (params && typeof params === 'object') {
        data = Object.assign({}, params);
    } else if (params && Array.isArray(params)) {
        data = params.slice();
    }

    // Resolve parameters
    let station_Id = '';
    if (data && typeof data === 'object' && Object.keys(data).length) {
        if (data.stationId) {
            station_Id = data.stationId;
            delete data.stationId;
        }
    }

    // Verify path
    while (path.charAt(0) === '/') {
        path = path.substr(1);
    }
    if (path.charAt(0) !== '/') {
        path = '/' + path;
    }
    while (path.charAt(path.length - 1) === '/') {
        path = path.substring(0, path.length - 1);
    }

    // Verify method
    if (method === METHOD.POST || method === METHOD.PUT) {
        data = data && JSON.stringify(data);
    } else {
        path += GetSuffix(data);
        data = undefined;
    }

    const host = release ? online : debug;
    const url = host + path;

    return WKStorage.getItem(CacheKeys.systemInfo).then(ret => {
        const {
            token,
            firmId,
            stationId,
            userId
        } = ret;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access-token': token,
            'firm-id': firmId,
            'user-id': userId,
            'station-id': station_Id || stationId,
        };
        return axios({
            method,
            url,
            data,
            headers,
            timeout,
        }).then((res) => {

            if (!res.data || !Object.keys(res.data).length) {
                const {
                    errorCode,
                    errorMsg
                } = res;
                return {
                    ok: errorCode === 0,
                    errorCode: errorCode || '-1',
                    errorMsg: errorMsg || 'Empty Data Error',
                    data: null,
                    result: null,
                };
            }
            const {data} = res;
            const {
                errorCode,
                errorMsg
            } = data;
            const ok = errorCode === 0;
            if (typeof data === 'object' && Object.keys(data).length) {
                delete data.errorCode;
                delete data.errorMsg;
            }

            // Update token
            if (path === '/login/status' && data.results && typeof data.results === 'string') {
                WKStorage.setItem(CacheKeys.systemInfo, new SystemModel(data.results, firmId, stationId, userId));
            }

            if (errorCode === 54) {
                WKToast.show(WK_T(wkLanguageKeys.invalid_token));
                DeviceEventEmitter.emit(EmitterEvents.INVALID_TOKEN_TO_LOGIN);
            }

            return {
                ok,
                errorCode,
                errorMsg: resolveErrorMsg(errorMsg, errorCode),
                result: data.results,
                data,
            };

        }).catch((error) => {

            const {
                request,
                response
            } = error;

            /****************** unknown error ******************/
            if (!request && !response) {
                return {
                    ok: false,
                    errorCode: -1012,
                    errorMsg: error,
                };
            }

            let errorCode = response ? response.status : request.status;
            let errorMsg = response ? response.data : request._response;

            /****************** server error ******************/
            if (errorCode === 503 || errorCode === 500) {
                errorMsg = 'Internal server error';
            }

            if (request && request._hasError && errorMsg.substr(0, 20) === 'Failed to connect to') {
                errorMsg = 'Disconnected to server';
            }

            if (errorCode === 404) {
                errorMsg = 'Not Found';
            }

            if (error.message) {
                errorMsg = error.message;
            }

            if (errorCode === 502) {
                errorMsg = '502 Bad Gateway';
            }

            if (errorMsg && errorMsg.indexOf('html') >= 0) {
                errorMsg = 'Request failed';
            }

            /****************** client error ******************/
            if (error.request) {
                if (error.request._timedOut) {
                    errorCode = -1013;
                    errorMsg = 'Connection Timeout';
                } else {
                    if (error.request._response === '似乎已断开与互联网的连接。') {
                        errorCode = -1014;
                        errorMsg = 'The internet connection appears to be offline';
                    }
                }
            }

            return {
                ok: false,
                errorCode,
                errorMsg: resolveErrorMsg(errorMsg, errorCode),
                data: null,
                result: null,
            };

        });
    }).catch(() => {
        WKStorage.setItem(CacheKeys.systemInfo, new SystemModel('', '', '', ''));
        return {
            ok: false,
            errorCode: -1015,
            errorMsg: 'No cache key is set before logging in',
            data: null,
            result: null,
        };
    });

}

// Get rid of error code inside error message.
function resolveErrorMsg(msg, code) {
    const codeStr = `${code}`;
    if (msg && msg.indexOf(codeStr) >= 0) {
        return msg.replace(codeStr, '');
    }
    return msg;
}