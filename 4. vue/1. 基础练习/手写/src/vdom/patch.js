export function patch(oldVnode, vnode) {
    /**
     * 情况1： 没有el也没有oldVnode
     */
    if (!oldVnode) {
        console.log('没有el');
        // 组件的创建过程是没有el属 性的
        return createEle(vnode)
    } else {
        console.log('有el');
        // Vnode没有设置nodeType，值为undefined，真实节点可以获取到nodeType
        const isRealElement = oldVnode.nodeType;

        /**
         * 情况2：如果oldVnode为真实DOM，则将vnode转化成真实dom，替换掉老的DOM
         */
        if (isRealElement) {
            const oldElm = oldVnode;
            const parentElm = oldElm.parentNode;
            // 将虚拟dom转化成真实dom节点
            const el = createElm(vnode)
            console.log('虚拟dom解析后:', el, oldElm.nextSibling);

            // 插入到 老的el节点 的下一个节点的前面，就相当插入到老的el点解的后面
            // 这里不直接使用父元素appendChild是为了不破坏替换的位置
            parentElm.insertBefore(el, oldElm.nextSibling);

            // 删除老的el节点
            parentElm.removeChild(oldVnode);

            return el;
        } else {
            /**
             * 情况3：oldVnode是虚拟DOM则说明是更新，后续再分析
             */
        }
    }
}

// 虚拟dom转成真实dom
function createElm(vnode) {
    const { tag, data, key, children, text } = vnode;

    // 文本标签的tag是undefined，元素的是string
    if (typeof tag === 'string') {
        // 虚拟dom的el属性指向真实dom，方便后续更新diff算法操作
        vnode.el = document.createElement(tag)

        // 解析vnode属性
        updateProperties(vnode)

        // 如果有子节点就递归插入到父节点里面
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        });
    } else {
        vnode.el = document.createTextNode(text)
    }

    return vnode.el
}

// 解析vnode的data属性，映射到真实dom上
function updateProperties(vnode, oldProps = {}) {
    const newProps = vnode.data || {};
    const el = vnode.el; // 真实节点

    // 如果新的节点没有 需要把老的节点属性移除
    for(const k in oldProps) {
        if (!newProps[k]) {
            el.removeAttribute(k)
        }
    }

    // 对style样式做特殊处理 如果新的没有 需要把老的style值置为空
    const newStyle = newProps.style || {};
    const oldStyle = oldProps.style || {};
    for (const key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = '';
        }
    }

    // 遍历新的属性，进行增加操作
    for(const key in newProps) {
        if (key === 'style') {
            for (const styleNmae in newStyle) {
                el.style[styleNmae] = newStyle[styleNmae]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            // 给这个元素添加属性 值就是对应的值
            el.setAttribute(key, newProps[key])
        }
    }
}