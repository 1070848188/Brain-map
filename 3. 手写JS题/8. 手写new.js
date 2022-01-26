/** 
 * @description new做了哪些事情
 * 1. 初始化一个对象作为实例化对象
 * 2. 实例化对象的__proto__指向构造函数.prototype
 * 3. 构造函数的this指向这个实例对象
 * 4. 执行构造函数，返回实例对象
*/

function myNew () {
    const fn = Array.from(arguments).shift() // 获取函数
    const obj = Object.create(fn.prototype) // 改变 __proto__
    const result = fn.apply(obj, arguments) // 执行函数
    return (typeof result === 'object' || typeof result === 'function') && result !== null ? result : obj
}

function Test(name) {
    this.name = name
}

const myObj = myNew(Test, '张三')

console.log(myObj.__proto__ === Test.prototype);