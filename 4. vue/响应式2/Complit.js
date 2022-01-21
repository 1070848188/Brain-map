/**
 * @description 编译模板 将data中的数据与页面相关联依赖进行绑定更新
 * @class Complit
 */
class Complit {
    constructor (vm, el) {
        this.$el = typeof el === 'string' ?
            document.querySelector(el) : el
        this.$vm = vm

        this.compliter(this.$el) // 渲染模板
    }

    /**
     * @description 从根节点开始递归遍历 渲染模板
     * @param {Element} el 根元素节点
     * @memberof Complit
     */
    compliter(el) {
        [...el.childNodes].forEach(node => {
            if (node.nodeType === 1) { // 针对元素节点
                this.elementComplit(node)
                // 如果存在子节点 递归遍历
                node.childNodes.length > 0 && this.compliter(node)
            } else if (this.isInter(node)) { // 针对文本节点，并带有{{}}模板语法进行操作
                const key = RegExp.$1.trim() // 获取模板语法内的key
                this.textComplit(node, key)
            }
        })
    }

    /**
     * @description 判断节点是否时文本节点并带有{{}}模板语法进行操作
     * @param {*} node
     * @memberof Complit
     */
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    /**
     * @description 文本节点变更 渲染视图层发生改变
     * @param {*} node 需要操作的文本
     * @param {*} val 新的值
     * @memberof Complit
     */
    textComplit(node, key) {
        const reg = /\{\{(.*)\}\}/g
        const content = node.textContent // 保存原文本内容 携带{{ xxx }} 模板语法的
        node.textContent = content.replace(reg, this.$vm[key] ?? '') // 只替换{{}}部分
        new Watcher(this.$vm, key, newVal => {
            node.textContent = content.replace(reg, newVal ?? '') // 同理：只替换{{}}部分
        })
    }

    /**
     * @description 判断元素节点是否存在v-开头属性 并分发任务渲染函数
     * @param {*} node 元素节点
     * @memberof Complit
     */
    elementComplit(node) {
        node && [...node.attributes].forEach(attr => {
            const attrName = attr.name
            const attrValue = attr.value
            if (attrName.startsWith('v-')) { // 是否v-开头
                const fnName = attrName.slice(2) // 截取v-后的指令
                this[fnName] ? this[fnName](node, attrValue) :
                    this.updater(node, attrValue, fnName) // 渲染函数
            }
            // 事件绑定相关
            if (attrName.startsWith('v-on') || attrName.startsWith('@')) {
                // 使用v-on添加事件或使用@添加事件
                this.addEvent(node, attrName, attrValue)
            }

            // 属性绑定相关
            if(attrName.startsWith('v-bind') || attrName.startsWith(':')) {
                this.addAttr(node, attrName, attrValue)
            }

        })
    }

    /**
     * @description 给元素添加属性
     * @param {*} node 需要操作的元素
     * @param {*} attrName 事件名称
     * @param {*} attrValue 执行的回调方法
     * @memberof Complit
     */
     addAttr(node, attrName, attrValue) {
        const name = this.getAttrName(attrName)
        const value = this.$vm[attrValue]
        node[name] = value || ''
     }

     /**
     *@description 获取绑定事件的名称
     * @param {*} attr
     * @memberof Complit
     */
    getAttrName(attrName) {
        const event = attrName.startsWith('v-bind') ? attrName.split(':') : attrName.split(':')
        return event && event[1]
    }

    /**
     * @description 给元素添加绑定事件
     * @param {*} node 需要操作的元素
     * @param {*} attrName 事件名称
     * @param {*} key 需要更新的属性
     * @memberof Complit
     */
    addEvent(node, attrName, key) {
        const name = this.getEventName(attrName)
        let fn = this.$vm.$methods[key]
        if (node && name && fn) {
            node.addEventListener(name, fn.bind(this.$vm))
        }
    }

    /**
     *@description 获取绑定事件的名称
     * @param {*} attr
     * @memberof Complit
     */
    getEventName(attrName) {
        const event = attrName.startsWith('v-on') ? attrName.split(':') : attrName.split('@')
        return event && event[1]
    }


    /**
     * @description 统一渲染函数入口 页面所有数据初始化都需要经过这个方法
     * @param {*} node 要操作的节点
     * @param {*} key  更新的属性名称
     * @param {*} fnName 需要操作的更新方法名称
     * @memberof Complit
     */
    updater (node, key, fnName) {
        const fn = this[`${fnName}Updater`]
        fn && fn.call(this.$vm, node, this.$vm[key] ?? '')
        new Watcher(this.$vm, key, newVal => {
            fn && fn(node, newVal ?? '')
        })
    }
    
    /**
     * @description v-model指令
     * @memberof Complit
     */
    model (node, key) {
        this.updater(node, key, 'model')

        // 这里还需要新增input事件进行监听数据改变
        node.addEventListener('input', e => {
            this.$vm[key] = e.target.value
        })
    }


    /**
     * @description 文本节点更新函数
     * @memberof Complit
     */
    textUpdater(node, val) {
        node.textContent =val
    }

    /**
     * @description html代码更新函数
     * @memberof Complit
     */
    htmlUpdater (node, val) {
        node.innerHTML = val
    }

    /**
     * @description v-model指令
     * @memberof Complit
     */
    modelUpdater (node, val) {
        // 首先同步数据
        node.value = val
    }

}