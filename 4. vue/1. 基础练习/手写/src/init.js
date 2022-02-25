import { initState } from './state'

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // this指向实例
        const vm = this;
        vm.$options = options; // 在实例上添加options属性
        // callHook(cm, 'beforeCreate')

        // 初始化状态  包括initProps initMethod  initData、initComputed、initWatch等
        initState(vm)

        // callHook(cm, 'create')
        // 如果有el属性 进行模板渲染
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function(el) {}
}
