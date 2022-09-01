// 题目描述:实现一个发布订阅模式拥有 on emit once off 方法
class eventBus {
    constructor () {
        this.events = {}
    }

    on (eventName, callBack) {
        !this.events[eventName] && (this.events[eventName] = [])
        this.events[eventName].push(callBack)
    }

    emit (eventName, ...params) {
        this.events[eventName] && this.events[eventName].map(cb => cb(...params))
    }

    off (eventName) {
        delete this.events[eventName]
    }

    once (...params) {
        this.emit(...params)
        this.off(...params)
    }
}

const bus = new eventBus()

bus.on('add', (num) => { count.innerHTML = Number(count.innerHTML) + num })
