
function fun(b, c, d) {
    console.log(this.a, b, c, d);
}

const a = 10;

const obj = { a: 20 }

fun.call(obj, 222, 333, 444)
fun.apply(obj, [222, 333, 444])
fun.bind(obj)(222, 333, 444)

myCall(fun, obj, 222, 333, 444)
myApply(fun, obj, [222, 333, 444])
myBind(fun, obj)(222, 333, 444)

function myCall (callBack, context = window, ...args) {
    const keys = Symbol()
    context[keys] = callBack
    const res = context[keys](...args)
    delete context[keys]
    return res
}

function myApply (callBack, context = window, params) {
    const keys = Symbol()
    context[keys] = callBack
    const res = context[keys](...params)
    delete context[keys]
    return res
}

function myBind (callBack, context = window) {
    const keys = Symbol()
    context[keys] = callBack
    return function (...params) {
        const res = context[keys](...params)
        delete context[keys]
        return res
    }
}
