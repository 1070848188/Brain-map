// 重写数组方法
const oldArrayPrototype = Array.prototype; // 首先保存原始的Array上面的方法
// 通过Objcet.create方法创建一个新的对象，并把新对象的__proto__指向oldArrayPrototype
let arrayMethods = Object.create(oldArrayPrototype);

let methods = [ // 数组的7种可以改变数组本身的方法
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reseres',
    'sort'
]

methods.forEach(method => {
    // 重写数组原型上的方法
    arrayMethods[method] = function (...args) {
        // 首先执行数组原型上的原有方法，不影响原数组的逻辑
        const result = oldArrayPrototype[method].call(this, ...args)
        const ob = this.__ob__; // 获取数组本身的Observer实例
        let inserted;
        // 这里获取给数组新增的数据
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2)
            default:
                break;
        }
        if (inserted) ob.observeArray(inserted) // 对新增的数据进行响应式处理

        // 数组派发更新
        ob.dep.notify()
        return result // 将原数组的返回值返回给用户
    }
})

export default arrayMethods