import moment from 'moment';

/**
 * Get Today
 * @returns {string} for example: "2019-07-18"
 */
export function today() {
    return moment().format('YYYY-MM-DD');
}

/**
 * Subtract one day
 * @param day: String type, for example: "2019-07-18"
 * @returns {string}: for example: "2019-07-17"
 */
export function subtractDay(day) {
    return moment(day).subtract(1, "d").format('YYYY-MM-DD');
}

/**
 * Add one day
 * @param day: String type, for example: "2019-07-17"
 * @returns {string}: for example: "2019-07-18"
 */
export function addDay(day) {
    return moment(day).add(1, "d").format('YYYY-MM-DD');
}

/**
 * Get english word month
 * @param num: Number type, such as 1 means Jan, 2 means Feb
 * @returns {string}: Jan、Feb and the like
 */
export function englishWordMonth(num) {
    return moment().month(num - 1).format("MMM");
}

/**
 * Get the start date of current month
 * @returns {string}: for example, today is "2019-07-19", return "2019-07-01".
 */
export function startOfCurrentMonth() {
    return moment().startOf('M').format('YYYY-MM-DD');
}

/**
 * Get the end date of current month
 * @returns {string}: for example, today is "2019-07-19", return "2019-07-31".
 */
export function endDateOfCurrentMonth() {
    return moment().endOf('M').format('YYYY-MM-DD');
}

/**
 * Get the start date of current month ahead of two months
 * @returns {string}: for example, today is "2019-07-19", namely July, return "2019-05-01", namely May.
 */
export function startOfAheadTwoMonth() {
    return moment().startOf('M').subtract(2, 'M').format('YYYY-MM-DD');
}

/**
 * Add one month
 * @param date: string type, for example "2019-07-19"
 * @param amount: Number type, amount of months, default is 1
 * @returns {string}: "2019-08-19"
 */
export function addMonth(date: string, amount = 1) {
    return moment(date).add(amount, 'M').format('YYYY-MM-DD');
}

/**
 * Subtract one month
 * @param date: string type, for example "2019-07-19"
 * @param amount: Number type, amount of months, default is 1
 * @returns {string}: "2019-06-19"
 */
export function subtractMonth(date: string, amount = 1) {
    return moment(date).subtract(amount, 'M').format('YYYY-MM-DD');
}

/**
 * Add one year
 * @param date: string type, for example "2019-07-19"
 * @param amount: Number type, amount of months, default is 1
 * @returns {string}: "2020-06-19"
 */
export function addYear(date: string, amount = 1) {
    return moment(date).add(amount, 'Y').format('YYYY-MM-DD');
}

/**
 * Subtract one year
 * @param date: string type, for example "2020-07-19"
 * @param amount: Number type, amount of months, default is 1
 * @returns {string}: "2019-06-19"
 */
export function subtractYear(date: string, amount = 1) {
    return moment(date).subtract(amount, 'Y').format('YYYY-MM-DD');
}

/**
 * Get the start date of current week, in general, the date must be Sunday.
 * @returns {string}: "2019-07-14" -- Sunday
 */
export function startDateOfCurrentWeek() {
    return moment().startOf('w').format('YYYY-MM-DD');
}

/**
 * Get the end date of current week, in general, the date must be Saturday.
 * @returns {string}: "2019-07-20" -- Saturday
 */
export function endDateOfCurrentWeek() {
    return moment().endOf('w').format('YYYY-MM-DD');
}

/**
 * Subtract one week
 * @param date: for example, "2019-07-14"
 * @returns {string} "2019-07-07"
 */
export function subtractWeek(date) {
    return moment(date).subtract(1, 'w').format('YYYY-MM-DD');
}

/**
 * Add one week
 * @param date: for example, "2019-07-14"
 * @returns {string} "2019-07-21"
 */
export function addWeek(date) {
    return moment(date).add(1, 'w').format('YYYY-MM-DD');
}






export function week() {
    return moment().w();
}

export function getYesterday() {
    return moment().subtract(1, 'days').format('YYYY-MM-DD')
}

// 本月
export function getSameMonth() {
    return moment().format('YYYY-MM')
}

// 今年
export function getSameYear() {
    return moment().format('YYYY')
}

// 上月
export function getLastMonth() {
    return moment().subtract(1, 'month').format('YYYY-MM')
}

// 获取当前月的开始结束时间
export function getCurrMonthDays() {
    let date = []
    let start = moment().add(0, 'month').format('YYYY-MM') + '-01'
    let end = moment(start).add(1, 'month').add(-1, 'days').format('YYYY-MM-DD')
    date.push(start);
    date.push(end);
    return date
}

//获取当前年月日时分秒日期格式
export function getCompleteTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

// 将毫秒或中国标准时间转化为年月日时分秒日期格式
export function timestampToTime(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD')
}

export function before30Days() {
    return moment().subtract(29, 'days').format('YYYY-MM-DD');//30天前
}

export function timeFormat(originalTime) {
    if (originalTime === 'undefined' || originalTime === 'null') return '0小时0分钟0秒';
    let time = originalTime;
    const timeArr = originalTime.replace('小时', '-').replace('分钟', '-').replace('秒', '-').split('-');
    const hour = parseInt(timeArr[0]);
    const minutes = parseInt(timeArr[1]);
    const seconds = parseInt(timeArr[2]);
    if (hour && !seconds && !minutes) {
        time = hour + '小时整'
    }
    if (hour && !seconds && minutes) {
        time = hour + '小时' + minutes + '分钟整'
    }
    if (!hour && seconds && minutes) {
        time = minutes + '分钟' + seconds + '秒'
    }
    if (!hour && !seconds && minutes) {
        time = minutes + '分钟整'
    }
    if (!hour && seconds && !minutes) {
        time = seconds + '秒'
    }
    return time;
}