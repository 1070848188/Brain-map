// 用法如下:
function fn1(x) {
    return x + 1;
}
function fn2(x) {
    return x + 2;
}
function fn3(x) {
    return x + 3;
}
function fn4(x) {
    return x + 4;
}
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 1+4+3+2+1=11


// 我的实现
function compose(...params) {
    if (!params.length) return (v) => v // 没有参数
    if (params.length === 1) return params[0] // 只有一个
    return function (start) {
        // 遍历函数数组
        return params.reduce((prive, current) => typeof current === 'function' ?
            current(prive) || prive : prive, start)
    }
}

// 鲨鱼哥实现
function compose(...fn) {
    if (!fn.length) return (v) => v;
    if (fn.length === 1) return fn[0];
    return fn.reduce(
        (pre, cur) =>
            (...args) =>
                pre(cur(...args))
    );
}