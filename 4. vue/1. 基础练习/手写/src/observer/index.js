import arrayMethods from './array'
import Dep from './dep'
import Watcher from './watcher';

export function observe(data) {
    // 如果是object类型（对象或数组）才观测；
    // 第一次调用observe(vm.$options._data)时，_data一定是个对象（data函数返回一个对象）
    if (!(typeof data === 'object' && data !== null)) {
        return;
    }

    // 如果已经是响应式的数据，直接return
    if (data.__ob__) {
        return;
    }

    // 返回经过响应式处理之后的data
    return new Observer(data)
}

/**
 * @description 将数据处理为可响应数据
 *  + 首先在总的data上添加__ob__属性
 *  + 然后判断数据类型 对象类型 or 数组类型是不同的处理逻辑
 *      + 对象类型： 递归遍历所有属性，监听每个属性的变化，get收集依赖，set去触发所有依赖的更新函数，实现更新视图
 *      + 数组类型： 重写7种可以改变数组本身的方法，触发方法时，通知所有依赖执行更新函数，更新视图
 */
class Observer {
    constructor(data) {
        this.value = data;
        this.dep = new Dep(); // 给data添加一个dep 收集data整体的一个dep(主要用于数组的依赖收集)

        // 在数据data上新增属性 data.__ob__；指向经过new Observer(data)创建的实例
        // 可以访问Observer.prototype上的方法observeArray、walk等
        // 所有被劫持过的数据都有__ob__属性（通过这个属性可以判断数据是否被检测过）
        Object.defineProperty(data, '__ob__', {
            // 值指代的就是Observer的实例，即监控的数据
            value: this,
            //  设为不可枚举，防止在forEach对每一项响应式的时候监控__ob__，造成死循环
            enumerable: false,
            writable: true,
            configurable: true
        })

        /**
         * 思考一下数组如何进行响应式？
         * 和对象一样，对每一个属性进行代理吗？
         * 如果数组长度为10000，给每一项设置代理，性能非常差！
         * 用户很少通过索引操作数组，我们只需要重写数组的原型方法，在方法中进行响应式即可。
         */
        if (Array.isArray(data)) {
            // 数组的响应式处理
            data.__proto__ = arrayMethods

            this.observeArray(data)
        } else {
            // 对象的响应式处理
            this.walk(data)
        }
    }

    /** 
     * @description 对对象进行递归遍历，实现可响应式
    */
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
    /** 
     * @description 对数组进行递归遍历，实现数组内存在对象类型数据进行响应式
    */
    observeArray(data) {
        data.forEach(item => observe(item))
    }
}

function defineReactive(data, key, value) {
    let childOb = observe(value) // 【关键】递归，劫持对象中所有层级的所有属性
    // 如果Vue数据嵌套层级过深 >> 性能会受影响【******************************】
    let dep = new Dep() // 为每一个属性创建一个独一无二的dep
    Object.defineProperty(data, key, {
        get() {
            // 依赖收集
            if (Dep.target) {
                dep.depend()
                // 如果属性的值依然是一个数组/对象，则对该 数组/对象 整体进行依赖收集
                if (childOb) {
                    childOb.dep.depend();
                    // 如果数据结构类似 {a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套
                    // 数组包含数组的情况，那么我们访问a的时候，只是对第一层的数组进行了依赖收集
                    // 里面的数组因为没访问到，所以无法收集依赖，但是如果我们改变了a里面的第二层数组的值
                    // 是需要更新页面的，所以需要对数组递归进行依赖收集
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if (value === newValue) return
            value = newValue
            // 通知所有依赖更新数据
            dep.notify() // 通知dep存放的wathcers去更新 -- 派发更新
        }
    })
}

function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        // 对每一项进行依赖收集
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}