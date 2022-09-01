import { createElement, createTextNode } from './vdom/index'
export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        const vm = this;

        // 获取模板编译生成的render方法
        const { render } = vm.$options;

        // 生成vnode -- 虚拟dom
        const vnode = render.call(vm)
        console.log(vnode);
        return vnode
    }

    Vue.prototype._c = function (...args) {
        // 创建虚拟dom元素
        return createElement(this, ...args);
    }

    Vue.prototype._v = function (text) {
        // 创建虚拟dom文本
        return createTextNode(this, text)
    }

    Vue.prototype._s = function (val) {
        // 如果模板里面的是一个对象 需要JSON.stringify
        return val == null
            ? ""
            : typeof val === 'object'
            ? JSON.stringify(val)
            : val
    }
}