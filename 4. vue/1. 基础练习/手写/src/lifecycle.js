import { patch } from './vdom/patch'
export function lifecycleMixin(Vue) {
    // _update：初始挂载及后续更新
    // 更新的时候，不会重新进行模板编译，因为更新只是数据发生变化，render函数没有改变。
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const prevVnode = vm._vnode; // 保留上一次的vnode
        vm._vnode = vnode; // 获取本次的vnode

        // 这里判断是否是初次渲染
        if(!prevVnode) {  // 初次渲染 vm._vnode肯定不存在 要通过虚拟节点 渲染出真实的dom 赋值给$el属性
            vm.$el = patch(vm.$el, vnode)
        } else { // 更新时把上次的vnode和这次更新的vnode穿进去 进行diff算法
            // 视图更新
            vm.$el = patch(prevVnode, vnode)
        }
    }
}

// 主要执行了两个方法 vm._render和vm._update
export function mountComponent(vm, el) {
    vm.$el = el;
    // 执行beforeMount声明周期函数
    // callHook(vm, "beforeMount")

    /**
    * _render执行了render函数生成VNode
    * _update两个过程：
    *   1. 初次渲染时直接将VNode挂载到页面上
    *   2. 更新时，比较新旧VNode，经过diff算法，渲染真实DOM
    */
    let updateComponent = () => {
        
        vm._update(vm._render())
    }

    updateComponent();

    //   创建一个Watcher，后续在响应式时再实现
    //   new Watcher(
    //     vm,
    //     updateComponent,
    //     () => {
    //       callHook(vm, "beforeUpdate");
    //     },
    //     true
    //   );


    // callHook(vm, 'mounted');
}