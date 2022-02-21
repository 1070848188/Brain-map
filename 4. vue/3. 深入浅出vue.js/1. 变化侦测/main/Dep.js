/** 
 * @description 依赖收集第二版
 * @class Dep
 * @name 依赖收集及触发类
 *  将收集依赖和触发依赖更新的操作抽离出一个类
*/
class Dep {
    constructor () {
        this.subs = []
    }

    addSub (sub) {
        this.subs.push(sub)
    }

    removeSub (sub) {
        remove(this.subs, sub)
    }

    depend() {
        Dep.target && this.subs.push(Dep.target)
    }

    notify(newValue) {
        this.subs.forEach(watcher => watcher.update(newValue))
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        return index !== -1 ? arr.splice(index, 1) : null
    }
}
