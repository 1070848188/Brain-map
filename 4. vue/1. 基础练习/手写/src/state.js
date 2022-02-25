import { observe } from './observer/index'

export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        // 初始化data
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }

    function initProps() { }
    function initMethod() { }
    function initData(vm) {
        let data = vm.$options.data;
        // 往实例上添加一个属性 _data，即传入的data
        // vue组件data推荐使用函数 防止数据在组件之间共享
        data = vm._data = isFunction(data) ? data.call(vm) : data;

        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                proxy(vm, "_data", key)
            }
        }
        // 对数据进行观测 -- 数据响应式
        observe(data)
    }
    function initComputed() { }
    function initWatch() { }

}

/**
 * @description 将vm._data上的属性读写代理到vm上
 */
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

function isFunction(value) {
    return typeof value === 'function'
}
