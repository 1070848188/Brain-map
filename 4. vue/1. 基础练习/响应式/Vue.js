class Vue {
    constructor (options) {
        // console.log('初始化vue');
        this.$data = options.data || {} // 将数据储存在本地
        this.$el = (typeof options.el === 'string') ?  // 储存根元素
            document.querySelector(options.el) : options.el
        // 将data中的数据代理到this上
        // console.log('代理数据');
        this.proxyData(this.$data)
        // console.log('准备进行数据劫持');
        new Observe(this.$data)
        // console.log('编译模板');
        // 编译模板
        new Compliter(this)
    }

    /**
     * @description 本方法主要方便调用Vue中的数据 同时触发Observe里的数据劫持
     * @param {*} data 要代理的数据
     * @memberof Vue
     */
    proxyData (data) {
        // 排除基本数据类型
        if (!data || typeof data !== 'object') return 
        Object.keys(data).forEach(key => {
            // 进行数据劫持 
            // 将$data里的数据代理到实例中
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newVal) {
                    if (newVal === data[key]) return
                    data[key] = newVal
                }
            })
        })
    }
}
