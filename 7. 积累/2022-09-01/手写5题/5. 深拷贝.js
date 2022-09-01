let f = [3, {
    g: 5
}]

let obj = {
    a: 1,
    b: '2',
    c: true,
    f,
    d: {
        e: 333,
        f
    }
}


function deepClone(params, hash = new WeakMap()) {
    if (typeof params !== 'object' && !Array.isArray(params)) return params;
    // 存在内存中
    if (hash.has(params)) { // 防止两个一样的变量放进来
        return hash.get(params)
    }
    let newObj = Array.isArray(params) ? [] : {};
    hash.set(params, newObj)
    Reflect.ownKeys(params).forEach(key => {
        newObj[key] = deepClone(params[key])
    })
    return newObj
}

const obj2 = deepClone(obj)

obj.d.e = 444
obj2.d.f[1].g = 444