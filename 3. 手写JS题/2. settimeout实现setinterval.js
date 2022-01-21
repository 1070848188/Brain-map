myInterval(function(a, b) {
    console.log(a + b);
}, 1000, 1, 2)

function myInterval (...params) {
    [callback, timeout, ...args] = params
    if (typeof callback !== 'function') new TypeError('callback must is function')
    setTimeout(callback(...args), timeout);
    console.log(callback, timeout, args);
}