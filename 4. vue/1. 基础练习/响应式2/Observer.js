/**
 * @description 实现数据的响应式
 * @class Observer
 */
class Observer {
    constructor(obj) {
       this.observe(obj)
    }

    /**
     * @description 判断是否是对象类型
     * @param {Object} obj 需要响应的数据
     * @memberof Vue
     */
    observe (obj) {
        if (typeof obj !== 'object' || !obj) return
         // 判断数据是对象还是数组
         if (Array.isArray(obj)) {
            // 数组响应式
        } else { // 对象响应式
            this.walk(obj)
        }
    }

    /**
     * @description 遍历数据 进行所有数据的劫持
     * @param {Object} obj
     * @memberof Observer
     */
    walk (obj) {
        Object.keys(obj).forEach(key => {
            this.defineReactive(obj, key, obj[key])
        })
    }

    /**
     * @description 数据劫持
     * @param {Object} data 需要劫持的对象
     * @param {String} key  属性名称
     * @param {*} val  属性值
     * @memberof Observer
     */
    defineReactive(data, key, val) {
        console.log(data, key, val);
        this.observe(val)
        const dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                dep.addSub()
                return val
            },
            set(newVal) {
                if (val === newVal) return
                val = newVal
                dep.notify()
            }
        })
    }

}