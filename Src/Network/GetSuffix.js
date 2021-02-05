/**
 * Used to format data for network request.
 * @param data
 * @returns {string}
 */
export default function (data) {

    if (!data || typeof data !== 'object') {
        return '';
    }

    let flag = true;
    let suffix = '';
    const keysArr = Object.keys(data).sort();

    keysArr.forEach((key) => {
        if (key
            && typeof data[key] !== 'object' // null is an object.
            && typeof data[key] !== 'undefined'
        ) {
            if (flag) {
                suffix = suffix + '?' + key + '=' + data[key];
                flag = false;
            } else {
                suffix = suffix + '&' + key + '=' + data[key];
            }
        }
    });

    return suffix;
}