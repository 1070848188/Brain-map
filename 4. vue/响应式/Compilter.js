
/**
 * @description 主要用于解析模板，指令
 * @param {Object} vm Vue类
 * @class Compliter
 */
class Compliter {
    constructor(vm) {
        // console.log('初始化Compliter');
        this.$vm = vm
        this.el = vm.$el
        this.complit(this.el)
    }

    // 编译模板
    complit(el) {
        [...el.childNodes].forEach(node => {
            // 文本节点
            if (this.isTextNode(node)) {
                this.textComplit(node)
            } else if (this.isElementNode(node)) {
                this.elementComplit(node)
            }
            this.complit(node)
        })
    }

    // 渲染文本节点
    textComplit(node) {
        // 获取文本节点中的{{}}包裹内容
        const reg = /\{\{(.+?)\}\}/
        if (reg.test(node.textContent)) {
            const key = RegExp.$1.trim() // 获取正则匹配到的字符
            console.log('创建一个watcher', node);
            new Watcher(this.$vm, key, newValue => {
                node.textContent = newValue
            })
            node.textContent = node.textContent.replace(reg, this.$vm[key]) // 替换内容
            // console.log(`文本节点发生改变: ${key} `);
        }
    }

    // 渲染元素节点
    elementComplit(node) {
        // 判断节点是否有指令
        [...node.attributes].forEach(attr => {
            let attrName = attr.name // 属性名称
            if (this.isDirective(attrName)) { // 已v-开头的属性
                attrName = attrName.slice(2) // 获取属性名
                const key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        // 这里统一分发任务  不同指令对应不同更新方法
        const fnName = this[`${attrName}Updater`]
        fnName && fnName.call(this, node, key, this.$vm[key])
    }

    // v-text
    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.$vm, key, newValue => {
            node.textContent = newValue
        })
    }

    // v-model
    modelUpdater(node, key, value) {
        node.value = value
    }

    // v-html
    htmlUpdater(node, key, value) {
        node.innerHTML = value
    }

    // 判断元素的属性是否是 vue 指令
    isDirective(attr) {
        return attr.startsWith('v-')
    }
    // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
    // 判断是否是 文本 节点
    isTextNode(node) {
        return node.nodeType === 3
    }

}
