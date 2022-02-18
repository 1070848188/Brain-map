/** 
 * @description 依赖收集第二版
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
        window.target && this.subs.push(window.target)
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

/** 
 * @description Watcher属于一个中介角色，数据更新会通知Watcher，然后Watcher负责通知使用到他的地方进行更新
*/
class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm // 保存当前对象
        this.getter = parseKey(key) // 生成getter函数，用来触发dep收集依赖
        this.cb = cb // 保存更新函数
        this.value = this.get()
    }

    get() {
        window.target = this // 将本依赖挂载到window上
        const value = this.getter.call(this.vm, this.vm) // 这里触发get事件，并把本依赖注入到dep中收集
        window.target = undefined // 收集完后清空
        return value
    }

    update (newValue) {
        const oldValue = this.value // 获取上次数据
        this.value = newValue // 读取最新数据
        this.cb.call(this.vm, newValue, oldValue) // 触发更新函数
    }
}

const bailRE = /[^\w.$]/
function parseKey(path) {
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


function defineReactive(data, key, value) {
    let dep = new Dep() // 创建一个依赖收集器
    Object.defineProperty(data, key, {
        configurable: true, // 是否可以改变值
        enumerable: true, // 是否可枚举  for  in 是否可以遍历
        get() {
            dep.depend() // 收集依赖
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

// 实验使用
const obj = { // 初始化数据
    message: '我是初始化的数据'
}

const pList = document.querySelectorAll('.define')

defineReactive(obj, 'message', obj.message) // 对数据进行侦测监听，变成响应式

function complier(msg) { // dom更新函数
    for (let index = 0; index < pList.length; index++) {
        const p = pList[index];
        p.innerHTML = msg
    }
}

// 依赖生成
new Watcher(obj, 'message', complier)
complier(obj.message) // 初次触发dom更新
