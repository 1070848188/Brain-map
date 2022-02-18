/** 
 * @description 依赖收集第一版
 *  + 页面中使用到了数据，那么就会触发get方法，这时候的dom更新操作保存到window.target上，便于全局查找
 *  + 把window.target拿出来放到dep数组中储存【这时候储存了数据的dom更新函数】
 *  + 当数据发生改变的时候，触发dom更新即可
*/
// function defineReactive(data, key, value) {
//     let dep = []
//     Object.defineProperty(data, key, {
//         configurable: true, // 是否可以改变值
//         enumerable: true, // 是否可枚举  for  in 是否可以遍历
//         get() {
//             window.target && dep.push(window.target)
//             return value
//         },
//         set(newValue) {
//             if (value === newValue) return
//             dep.forEach(cb => cb(newValue, value))
//             value = newValue
//         }
//     })
// }

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

    notify(newValue, value) {
        this.subs.forEach(cb => cb(newValue, value))
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        return index !== -1 ? arr.splice(index, 1) : null
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
            dep.notify(newValue, value)
            value = newValue
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
window.target = complier // 将数据挂到window上
complier(obj.message) // 初次触发dom更新
