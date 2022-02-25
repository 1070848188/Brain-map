import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { initGlobalApi } from './global-api/index'


function Vue(options) {
    // new Vue创建实例时会调用_init方法
    this._init(options)
}

initMixin(Vue) // 在原型上挂载_init方法
lifecycleMixin(Vue) // 在原型上挂载_update方法 (第一次创建dom及更新dom 有diff过程)
renderMixin(Vue) // 在原型上挂载_c,_v,_s,$nextTick,_render方法
initGlobalApi(Vue) // 初始化Vue.options 创建全局组件keep-alive, vue.component

export default Vue