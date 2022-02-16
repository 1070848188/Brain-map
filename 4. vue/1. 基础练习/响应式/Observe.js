
/**
 * @description Observe类主要用于实现data所有属性的getter setter
 *
 * @class Observe
 */
class Observe {
    constructor (data) {
        // console.log('初始化Observe并观察数据');
        this.walk(data)
    }

    walk(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, value) {
        this.walk(value) // 递归 把所有对象都进行监听
        const dep = new Dep()
        Object.defineProperty(obj, key,{
            enumerable: true,
            configurable: true,
            get() {
                console.log(Dep.target);
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (value === newValue) return
                console.log(`设置了${key}属性为${newValue}, 当前dep${dep}`);
                value = newValue
                dep.notify()
            }
        })
    }
}
