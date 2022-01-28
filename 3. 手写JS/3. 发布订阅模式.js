// 题目描述:实现一个发布订阅模式拥有 on emit once off 方法

class Bus {
    constructor () {
        this.events = {}
    }
    on (name, callBack) {
        name = String(name) // 初始化Key
        if (typeof callBack !== 'function') new TypeError('callBack must is callBack')
        console.log(this.events, name);
        !this.events[name] ? this.events[name] = [callBack] : this.events[name].push(callBack) // 事件监听
    }

    emit(name, ...args) {
        this.events[String(name)] && this.events[String(name)].forEach(callback => {
            callback(...args)
        })
    }

    off(name, callBack) {
        if (!this.events[name]) return
        this.events[name] = this.events[name].filter(fun => fun !== callBack)
    }
}

const vueBus = new Bus()

vueBus.on('max', (...args) => {
    console.log(Math.max(...args));
})

const mins = (...args) => {
    console.log(Math.min(...args));
}

vueBus.on('max', mins)

vueBus.emit('max', 3, 4, 5, 70)
vueBus.off('max', mins)

setTimeout(() => {
    vueBus.emit('max', 3, 4, 5, 60)
}, 1000);