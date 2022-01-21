/**
 * @description 依赖收集者 将所有依赖Watcher收集到实例化对象中 统一管理
 * @class Dep
 */
class Dep {
    constructor () {
        this.subs = []
    }

    /**
     * @description 新增依赖
     * @memberof Dep
     */
    addSub() {
        Dep.target && this.subs.push(Dep.target)
    }

    /**
     * @description 触发所有更新方法
     * @memberof Dep
     */
    notify() {
        this.subs.forEach(sub => sub.update && sub.update())
    }
}