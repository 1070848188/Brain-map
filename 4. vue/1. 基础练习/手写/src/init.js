import { initState } from './state'
import { complieToFunctions } from './complier/index'
import { mountComponent } from './lifecycle'

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
    /** 
     * 1. 存在render函数 =》 将render函数生成VNode,转换成真是DOM挂载到页面
     * 2. 不存在render && 存在template时，将template编译成render函数
     * 3. 不存在render && 不存在template,直接将template赋值成el元素，再编译成render函数
    */
    Vue.prototype.$mount = function(el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);

        /**
         * 1. 把模板转化成render函数
         * 2. 执行render函数，生成VNode
         * 3. 更新时进行diff
         * 4. 产生真实DOM
         */
        // 可以直接再options种写render函数，优先级比tempalte高
        if (!options.render) {
            let template = options.template;

            // 没有render和template  但是有el的时候
            if (!template && el) {
                template = el.outerHTML;
            }

            // 最终把template模板转化成render函数
            if (template) {
                const render = complieToFunctions(template)
                options.render = render;
            }
        }

        // 调用render方法,渲染成真实DOM
        // 组件挂载方法
        return mountComponent(vm, el) // 将render函数转化成真实DOM 挂载到页面
    }
}
