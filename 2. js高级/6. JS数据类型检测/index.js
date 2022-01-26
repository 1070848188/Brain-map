/** 
 * @description 自己实现一个instance_of
 *  + 首先判断是否存在Symbol.hasInstance方法
 *  + 然后遍历原型链查找
*/

// 我的实现
function instance_of (value, fn) {
    // + 首先判断是否存在Symbol.hasInstance方法
    if (fn[Symbol.hasInstance] && typeof fn[Symbol.hasInstance] === 'function') return fn[Symbol.hasInstance](value) // 返回执行结果
    // 没有则遍历原型链
    let construc = fn.__proto__

    while(construc) {
        if (construc.constructor) return true
        construc = construc.__proto__
    }
    return false
}

class Test {
    
}

class Dog {

}

const a = new Test()

console.log(instance_of(a, Dog));

// 视频实现
function instance_of (obj, Ctor) {
    if (obj == null) return false
    if (Ctor == null) throw new TypeError('。。。') // 右侧必须是一个对象
    if (!Ctor.prototype) throw new TypeError('。。。') // 构造函数需要有原型
    if (typeof Ctor !== 'function') throw new TypeError('。。。') // 必须是一个函数

    // 忽略原始值类型
    if (!/^(object|function)$/.test(typeof obj)) return false

    if (Ctor[Symbol.hasInstance] && typeof Ctor[Symbol.hasInstance] === 'function') return Ctor[Symbol.hasInstance](obj) // 返回执行结果

    let prototype = Object.getPrototypeOf(obj)
    while (prototype) {
        if (prototype === Ctor.prototype) return true
        prototype = Object.getPrototypeOf(prototype)
    }
    return false
}
