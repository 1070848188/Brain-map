// 自己实现
const timer = myInterval(function(a, b) {
    console.log(a + b);
}, 1000, 1, 2)

function myInterval (...params) {
    [callback, timeout, ...args] = params
    if (typeof callback !== 'function') new TypeError('callback must is function')
    let clearTimer = null
    function interval(...args) {
        callback(...args)
        clearTimer = setTimeout(interval, timeout, ...args);
    }
    interval(...args)
    return function () {
        clearTimeout(clearTimer)
    }
}

function myClearInterval(callback) {
    callback()
}

setTimeout(() => {
    myClearInterval(timer)
}, 3000);