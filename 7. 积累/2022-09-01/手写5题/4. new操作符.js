/** 
 * new都干了什么
 * 1. 创建一个空对象
 * 2. 改变this指向
 * 3. 执行函数
 * 4. 返回这个对象
*/

function myNew(fun, ...arg) {
    const obj = Object.create(fun.prototype) // 创建的对象的__proto__等于构造函数的prototype
    const res = fun.call(obj, ...arg) // 改变this指向 
    if (res && (typeof res === "object" || typeof res === "function")) {
        return res;
    }
    return obj;
}
