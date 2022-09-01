export function createTextNode (vm, text) {
    return new Vnode(undefined, undefined, undefined, undefined, text)
}

export function createElement(vm, tag, data = {}, ...children) {
    let key = data.key

    // 如果是普通标签
    if (isReservedTag(tag)) {
        return new Vnode(tag, data, key, children)
    } else {
        // 否则就是组件
    }
}
/**
 * @export
 * @class Vnode
 * @param {标签名} tag
 * @param {属性} data
 * @param {标签唯一的key} key
 * @param {子节点} children
 * @param {文本节点} text
 * @param {组件节点的其他属性} componentOptions
 */
export default class Vnode {
    constructor(tag, data, key, children, text, componentOptions) {
        this.tag = tag;
        this.data = data;
        this.key = key;
        this.children = children;
        this.text = text;
        this.componentOptions = componentOptions;
    }
}

function isReservedTag() {
    return true
}