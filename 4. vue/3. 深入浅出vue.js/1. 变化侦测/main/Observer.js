/** 
 * @description 生成响应式数据
 * @class Oberser
 * @name 生成响应式数据
 *  递归遍历源数据，生成响应式数据
*/
class Obserser {
    constructor (value) {
        this.value = value
        // 创建收集Array数组依赖的地方
        this.dep = new Dep() // 每个Observer实例都会有一个dep属性
        def(value, '__ob__', this) // 在每个数据上都增加一个__ob__的属性，这个属性是不可枚举，且值为Obserser本身
        if (!Array.isArray(value)) {
            this.walk(value)
        } else {
            // 处理数组的方法重定向
            const hasProto = '__proto__' in {};
            const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys)
            // 数组子元素也需要实现响应式
            this.observeArray(value)
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
    }

    observeArray(arr) {
        for (let item = 0; item < arr.length; item++) {
            observe(arr[item])
        }
     }
}

/** 
 * @description 对数据进行侦测
 *  + get方法触发，通知dep收集依赖
 *  + set方法触发，通知依赖更新数据，执行相对应的渲染函数
*/
function defineReactive(data, key, value) {
    if (typeof value === 'object') new Obserser(value)
    let childOb = observe(value)
    let dep = new Dep() // 创建一个依赖收集器
    Object.defineProperty(data, key, {
        configurable: true, // 是否可以改变值
        enumerable: true, // 是否可枚举  for  in 是否可以遍历
        get() {
            dep.depend() // 收集依赖
            // 这里收集Array依赖
            childOb && childOb.dep.depend()
            return value
        },
        set(newValue) {
            if (value === newValue) return
            value = newValue
            // 书中这里是不传值的，这里不传值虽然方便，但是会把同一个依赖收集两次，所以我修改了一下，最新数据
            // 不需要再去读取，及时更新就好，这样只收集一次依赖
            dep.notify(newValue)
        }
    })
}

/** 
 * @description 浏览器支持修改__proto__属性
 * @param value 需要覆盖的数组
 * @param methods 覆盖后的方法
*/
function protoAugment(value, methods) {
    value.__proto__ = methods
}

/** 
 * @description 浏览器不支持修改__proto__属性
 * @param value 需要覆盖的数组
 * @param methods 覆盖后的方法
 * @param keys 需要覆盖掉的方法
*/
function copyAugment(value, methods, keys) {
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        def(value, key, methods[key])
    }
}

/** 
 * @description 尝试为value创建一个Observer实例
 * 如果创建成功，直接返回新创建的Observer实例
 * 如果已经存在，直接返回它
*/
function observe(value) {
    if (typeof value !== 'object') return
    let ob;
    if (value.__ob__ && value.__ob__ instanceof Obserser) {
        ob = value.__ob__
    } else {
        ob = new Obserser(value)
    }
    return ob
}