/**
 * @description 主入口 Vue实例
 * @class Vue
 */
class Vue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods

        this.proxy(this.$data) // 将data上的数据代理到this上

        this.ob = new Observer(this.$data) // 实现数据的响应式

        new Complit(this, options.el)

    }
    

    /**
     * @description 将data中的数据代理到this上
     * @param {Object} obj 需要代理的数据
     * @memberof Vue
     */
    proxy (obj) {
        Object.keys(obj).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() { // 从this获取数据时 触发data中此属性的劫持
                    return obj[key]
                },
                set (newVal) { // 从this设置数据时 触发data中此属性的劫持
                    obj[key] = newVal
                }
            })
        })
    }

    $set(data, key, val) {
        this.ob.defineReactive(data, key, val)
    }

}