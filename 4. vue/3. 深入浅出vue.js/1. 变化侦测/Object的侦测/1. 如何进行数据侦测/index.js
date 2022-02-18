function defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
        configurable: true, // 是否可以改变值
        enumerable: true, // 是否可枚举  for  in 是否可以遍历
        get() {
            return value
        },
        set(newValue) {
            if (value === newValue) return
            value = newValue
        }
    })
}