// 时间戳转化为年月日
export function timestampToTime(date) {
    var now = new Date(date * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    let result = year +
        '-' +
        ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
        '-' +
        ((date + 1) < 10 ? '0' + date : date) +
        ' ' +
        ((hour + 1) < 10 ? '0' + hour : hour) +
        ':' +
        ((minute + 1) < 10 ? '0' + minute : minute) +
        ':' +
        ((second + 1) < 10 ? '0' + second : second);

    return result;

}

// 中国标准时间转化为时间戳
export function dateToMs(date) {
    let result = Date.parse(date) / 1000;
    return result;
}