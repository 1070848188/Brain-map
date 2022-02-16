/**
 * @description 进行依赖收集 只要页面使用到data中的某个数据  触发渲染函数 就进行一次依赖收集
 * @param {Object} vm Vue实例
 * @param {String} key 要收集的属性
 * @class Watcher
 */
class Watcher {
    constructor(vm, key, fn) {
        this.$vm = vm
        this.$fn = fn
        this.$key = key
        Dep.target = this // 将当前Watcher挂载到Dep上
        this.$vm[key] // 动态调用一次属性  触发数据劫持的get方法 将Watcher添加到dep中
        Dep.target = null
    }

    update () {
        this.$fn && this.$fn(this.$vm[this.$key])
    }
}