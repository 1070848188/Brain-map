/** 
 * @class Watcher属于一个中介角色，数据更新会通知Watcher，然后Watcher负责通知使用到他的地方进行更新
*/
class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm // 保存当前对象
        this.getter = parseKey(key) // 生成getter函数，用来触发dep收集依赖
        this.cb = cb // 保存更新函数
        this.value = this.get()
    }

    get() {
        Dep.target = this // 将本依赖挂载到window上
        const value = this.getter.call(this.vm, this.vm) // 这里触发get事件，并把本依赖注入到dep中收集
        Dep.target = undefined // 收集完后清空
        return value
    }

    update (newValue) {
        const oldValue = this.value // 获取上次数据
        this.value = newValue // 读取最新数据
        this.cb.call(this.vm, newValue, oldValue) // 触发更新函数
    }
}

/**
 * @description 根据路径找到属性在对象中的值
 * @param {*} path 属性查找路径
 * @returns 读取到的数据
 */
 function parseKey(path) {
    const bailRE = /[^\w.$]/
    if (bailRE.test(path)) return
    const segments = path.split('.')
    return function(obj) {
        if (!obj) return
        for (let i = 0; i < segments.length; i++) {
            obj = obj[segments[i]];
        }
        return obj
    }
}