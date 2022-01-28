/** 
 * @description 
 *  call apply bind 都是用来改变函数的this指向的
 *  call 和 apply用法相同，只是入参方式不同
 *  bind则是返回一个函数供用户自主执行
*/

Function.prototype.myCall = function myCall(context, ...params) {
    if(typeof context === 'objcet' && context !== null) context = window
    const key = Symbol()
    context[key] = this
    const result = context[key](...params)
    delete context[key]
    return result
}

Function.prototype.myApply = function myApply(context, params) {
    if(typeof context === 'objcet' && context !== null) context = window
    const key = Symbol()
    context[key] = this
    const result = context[key](...params)
    delete context[key]
    return result
}

Function.prototype.myBind = function myBind(context, ...args) {
    if(typeof context === 'objcet' && context !== null) context = window
    const key = Symbol()
    context[key] = this
    const _this = this
    const result = function (...params) {
        // 若是将bind返回的函数当作构造函数去new
        if (this instanceof _this) {
            this[key] = _this // 这时候不需要去改变this指向
            this[key](...[...args, ...params])
            delete this[key]
        } else { // 普通函数执行
            context[key](...[...args, ...params])
            delete context[key]
        }
    }
    // 返回的函数需要继承执行函数的原型链
    result.prototype = Object.create(this.prototype)
    return result
}

function setName(name) {
    this.name = name
}

let obj = {
    name: '张三'
}

// const value = setName.myCall(obj, '李四')
// const value = setName.myApply(obj, ['李四'])
const fn = setName.myBind(obj)
const value = new fn('李四')
console.log(obj, value);