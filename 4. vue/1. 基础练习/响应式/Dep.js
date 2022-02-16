/**
 * @description Dep主要用来收集依赖
 * @class Dep
 */
class Dep {
    constructor () {
        this.subs = [] // 初始化依赖集合
    }

    addSub (sub) { // 新增依赖
        console.log('本依赖', this.subs);
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }

    notify() {
        this.subs.forEach(item => {
            item.update() // 将所有依赖视图更新
        })
    }
}
