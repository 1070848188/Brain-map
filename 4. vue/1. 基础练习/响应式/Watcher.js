/**
 * @description 属于观察者 将数据的变化绑定到dom中 渲染视图
 * @param {Object} vm 传入当前vue
 * @param {String} key 当前观察的key
 * @param {String} cb dom视图更新
 * @class Watcher
 */
class Watcher {
    constructor (vm, key, cb) {
        this.$vm = vm
        this.key = key
        this.cb = cb
        Dep.target = this
    }

    update() {
        let newValue = this.$vm[this.key]
        if (newValue === this.oldValue) return
        this.cb(newValue)
    }
}
