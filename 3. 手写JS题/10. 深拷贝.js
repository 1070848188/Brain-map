const isObject = val => typeof val === 'object' && val !== null

function deepClone(obj, hash = new WeakMap()) {
    if (!isObject(obj)) return obj // 不是对象
    if (hash.has(obj)) return hash.get(obj) // 是否已经克隆过此对象
    let target = Array.isArray(obj) ? [] : {}
    hash.set(obj, target)
    Reflect.ownKeys(obj).forEach(key => {
        if (isObject(obj[key])) {
            target[key] = deepClone(obj[key])
        } else {
            target[key] = obj[key]
        }
    })
    return target
}

let obj = {
    data: {
        arr: {
            age: 30
        }
    }
}

let obj2 = deepClone(obj)
let obj3 = deepClone(obj)
obj2.data.arr.age = 44
obj3.data.arr.age = 55
console.log(obj, obj2, obj3);