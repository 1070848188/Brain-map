/** 
 * @description 通过覆盖数组原型上七个可以改变自身的方法 实现拦截
 * @function {} pop shift push unshift sort reverse splice
*/

const arrayPro = Array.prototype; // 获取原型上的方法
const arrayMethods = Object.create(arrayPro); // 创建新的对象 并把新对象的__proto__指向原型

// 这里实现了arrayMethods 对象的封装和监听，若调用arrayMethods上的方法时,就会被拦截
['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
    const origin = arrayMethods[method] // 暂存原方法
      /* 拦截到数组改变后 
             * + 如何触发数组更新视图的动作？
             * + 在哪里去收集依赖
            */
    def(arrayMethods, method, function mutator(...args) { // 将原型上的方法进行拦截
        const result = origin.apply(this, args)
        const ob = this.__ob__;
        let inserted;
        switch (method) { // 对于数组上新增的项进行储存
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        inserted && ob.observeArray(inserted) // 对新增项进行响应式
        ob.dep.notify(ob.value)
        return result
    })
})


/** 
 * @description 尝试为value创建一个Observer实例
 * 如果创建成功，直接返回新创建的Observer实例
 * 如果已经存在，直接返回它
*/
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

// 这时候只需要将data中声明的数组原型链指向arrayMethods 那么就实现了对data中的数据单独进行拦截的功能
// => 具体改变  Observer类中拦截到的数组类型数据__proto__ = arrayMethods
