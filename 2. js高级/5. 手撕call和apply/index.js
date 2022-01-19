/** 
 * @description 手写call方法
 * @param {*} context 传入this指向对象
 * @param {Array} params 实参类集合
*/
function my_call (context, ...params) {
    // context是否为null 默认指向全局
    context === null && (context = window || undefined)
    if (!/^(object|function)$/.test(typeof context)) context = Object(context) // 普通类型包装成对象
    const self = this; // 这里this就是调用本方法的函数
    const key = Symbol('KEY'); // 默认生成一个不重复的key值
    context[key] = self // 将方法挂到context上 执行 那么this就指向context
    const result = context[key](params)
    delete context[key]
    return result
}

/** 
 * @description 手写apply方法
 * @param {*} context 传入this指向对象
 * @param {...} params 实参集合
*/
function my_apply (context, params) {
    // context是否为null 默认指向全局
    context === null && (context = window || undefined)
    if (!/^(object|function)$/.test(typeof context)) context = Object(context) // 普通类型包装成对象
    const self = this; // 这里this就是调用本方法的函数
    const key = Symbol('KEY'); // 默认生成一个不重复的key值
    context[key] = self // 将方法挂到context上 执行 那么this就指向context
    const result = context[key](...params)
    delete context[key]
    return result
}

/** 
 * @description 手写bind方法
 * @param {*} context 传入this指向对象
 * @returns 返回改变指向后的函数
*/
function my_bind (context) {
    // context是否为null 默认指向全局
    context === null && (context = window || undefined)
    if (!/^(object|function)$/.test(typeof context)) context = Object(context) // 普通类型包装成对象
    const self = this; // 这里this就是调用本方法的函数
    const key = Symbol('KEY'); // 默认生成一个不重复的key值
    context[key] = self // 将方法挂到context上 执行 那么this就指向context
    return function (...params) {
        const result = context[key](...params)
        delete context[key]
        return result
    }
}

// Function.prototype.my_call = my_call
// Function.prototype.my_apply = my_apply
Function.prototype.my_bind = my_bind

const obj = {
    name: 'obj',
    a: 5
}

function fn(a, b, c) {
    this.a = a
    this.b = b
    this.c = c
}

// fn.my_call(obj, 10, 20, 30)
// fn.my_apply(obj, [10, 20, 30])
fn.my_bind(obj)(10, 20, 30)

console.log(obj);