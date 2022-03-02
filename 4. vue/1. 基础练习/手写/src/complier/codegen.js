/** 
 * @description 将ast树转化成render函数
 * 1.render函数的格式：
 *  _c(
 *      'div', { id: 'app' },
 *      _c(
 *          'div', undefined, 
 *          _v('hello' + _s(name))
 *        ),
 *      _c(
 *          'span', undefined, 
 *          _v('world')
 *        )
 *     )
 *  _c是创建元素， _v是创建文本, _s时创建字符串，所以我们需要实现这三个方法
 *   否则在执行render函数的时候就会报错，他们都是可以直接通过实例调用的，则直接在Vue原型上挂载这三个方法即可
 * 
 * 2. 考虑到元素节点的子元素可能依然是一个元素节点，所以需要递归调用generate，需要把generate设置成一个入口函数
 *  children的生成用外部方法 getChildren(children)
 * 
 * 3. 一个元素的子节点可能不止一个，需要对children进行遍历，使用gen(child)生成每一个子元素
 * 
 * 4. 在生成children时需要分类型；当child为文本时，创建文本节点;是元素时，递归调用generate(node)
 * 
*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配花括号 {{  }}；捕获花括号里面的内容

export function generate(ast) {
    let children = getChildren(ast);
    // _c方法生成元素  三个参数 1. 标签名称  2. 属性{Object} 3. 子节点
    let code = `_c('${ast.tag}', ${
        ast.attrs.length ? `${genProps(ast.attrs)}` : "undefined"
    }${children ? `,${children}` : ""})`

    return code
}

// 处理attrs/props属性：将[{name: 'class', value: 'home'}, {name: 'style', value: "font-size:12px;color:red"}]
// 转化成 "class:"home",style:{"font-size":"12px","color":"red"}"
function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.name == 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(":");
                obj[key] = value
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

function getChildren(el) {
    const children = el.children;
    if (children) {
        return `${children.map(c => gen(c)).join(',')}`
    }
}

function gen(node) {
    // 如果是元素类型，递归调用generate(node)
    if (node.type === 1) {
        return generate(node)
    } else {
        let text = node.text;

        // 如果text中不存在花括号变量表达式
        if (!defaultTagRE.test(text)) {
            // _v表示创建文本
            return `_v(${JSON.stringify(text)})`
        }

        // 正则是全局模式 每次需要重置正则的lastIndex属性，不然会引发匹配bug
        //（defaultTagRE.exec()匹配完一次后，再次匹配为null，需要重置lastIndex）
        let lastIndex = (defaultTagRE.lastIndex = 0);
        let tokens = [];
        let match, index;
    
        // 如果text中存在花括号变量(使用while循环，是因为可能存在多个{{变量}})
        while((match = defaultTagRE.exec(text))) {
            // match如果匹配成功，结构为：['{{myValue}}', 'myValue', index: indexof({})]
            // index代表匹配到的位置
            index = match.index
    
            // 初始lastIndex为0, index > lastIndex，表示在{{前有普通文本
            if (index > lastIndex) {
                // 在tokens里面放入{{之前的普通文本
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
    
            // tokens中放入捕获到的变量内容
            tokens.push(`_s(${match[1].trim()})`);
            // 匹配指针后移,移到}}后面
            lastIndex = index + match[0].length
        }
    
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join("+")})`
    }
}