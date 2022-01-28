/** 
 * @description
 *  instanceof 是检测一个对象是否再原型链中出现过
*/

function my_instanceof (obj, context) {
    if (obj === null) return false
    if (context == null) throw new TypeError("Right-hand side of 'instanceof' is not an object")
    if (!context.prototype) throw new TypeError("Right-hand side of 'instanceof' is not callable")
    if (typeof context !== 'function') throw new TypeError("Right-hand side of 'instanceof' is not callable")
    
    // 忽略原始值类型
    if (!/^(object|function)$/.test(typeof obj)) return false

    // 首先看构造函数中是否存在Symbol.hasInstance方法，存在则把要验证的对象传进去执行，返回
    if (context[Symbol.hasInstance] && typeof context[Symbol.hasInstance] === 'function') return context[Symbol.hasInstance](obj)
    
    let Constr = Object.getPrototypeOf(obj) // 获取对象原型
    while (Constr) {
        if (Constr === context.prototype) return true
        Constr = Object.getPrototypeOf(Constr)
    }
    return false
}