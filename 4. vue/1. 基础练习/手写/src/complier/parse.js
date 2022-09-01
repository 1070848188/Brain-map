/** 
 * 实现思路
 * 1. 将tempalte匹配不同的正则(开始标签正则，结束标签正则，标签关闭正则，标签属性正则等)，匹配
 *  成功则交由不同别的方法处理(返回tagName， attributes， text等)
 * 2. 在处理方法handleStartTag种，返回一个描述元素的对象(包含tag, type, children, parent, attrs等)
 *  将他们push到一个栈
 * 3. 在处理方法handleEndTag种，将元素pop出栈，并设置它及上一个元素的parent，children关系
 * 4. 在处理方法handleChars中，设置文本为currentParent的children元素
 * 5. 解析完一部分，template就截取掉一部分，然后循环继续匹配，直到tempalte为空
 * 6. 通过进出栈操作，以及parent，children关系，建立一个树状结构(通过parent, children描述)
*/
// 以下为vue源码中的正则表达式
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名；形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签;形如 abc:234,前面的abc:可有可无；获取标签名；
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开头；形如  <  ；捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结尾，形如 >、/>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配结束标签 如 </abc-123> 捕获里面的标签名
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

export function parse(template) {
    /** 
     * handleStartTag、handleEndTag、handleChars将初始解析的结果，组装成一个树结构。
     * 使用栈结构构建AST树
    */
   let root; // 根节点
   let currentParent; // 下一个子元素的父元素
   let stack = []; // 栈结构：栈中push/pop元素节点，对于文本节点，直接push到currentParent.children即可，不用push到栈中
   // 表示元素和文本的type
   const ELEMENT_TYPE = 1;
   const TEXT_TYPE = 3;

   // 创建AST节点
   function createASTElement(tagName, attrs) {
       return {
           tag: tagName, // 标签名称
           type: ELEMENT_TYPE, // 元素节点
           children: [], // 默认子元素为空
           attrs, // 元素属性
           parent: null // 父元素默认为空
       }
   }

   /** 
    * 我这里的理解：
    * 模板解析是从头到尾的一个一个字符解析
    * 1. 此时解析到元素标签，若是开始变签，则调用handleStartTag初始化一个节点，入栈
    * 2. 解析到结尾标签，则出栈，且初始化父元素及子元素
   */

   // 对开始标签进行处理
   function handleStartTag({ tagName, attrs }) {
        let element = createASTElement(tagName,attrs) // 初始化一个节点
        // 如果没有根元素，则当前元素即为根元素
        if (!root) {
            root = element;
        }
        currentParent = element;
        // 将元素放入栈中
        stack.push(element)
   }

   // 对结束标签进行处理
   function handleEndTag(tagName) {
       // 处理到结束标签时，将该元素从栈中移出
       let element = stack.pop() // 栈的特点，先进后出，那么这时移出的就是最内层的元素
       if (element.tag !== tagName) {
           throw new Error('标签名有误')
       }
       // currentParent此时为element的上一个元素
       currentParent = stack[stack.length - 1]
       // 建立parent和children关系
       if (currentParent) {
           element.parent = currentParent;
           currentParent.children.push(element)
       }
   }

   // 对文本进行处理
   function handleChars(text) {
        // 去掉空格
        text = text.replace(/\s/g, "");
        if (text) {
            currentParent.children.push({
                type: TEXT_TYPE,
                text
            })
        }
   }

   /**
    * 递归解析template，进行初步处理
    * 解析开始标签，将结果{tagName, attrs}交给handleStartTag处理
    * 解析结束标签，将结果tagName交给handleEndTag处理
    * 解析文本将结果text交给handleChars处理
    */
   while (template) {
    // 查找<的位置，根据它的位置判断第一个元素是什么标签
    let textEnd = template.indexOf("<")

    // 当第一个元素为'<'时，即碰到开始标签/结束标签时
    if (textEnd === 0) {
        // 匹配开始标签<div>或<image/>
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
            handleStartTag(startTagMatch)
            continue
        }

        // 匹配结束标签</div>
        const endTagMatch = template.match(endTag)
        if (endTagMatch) {
            // endTagMatch如果匹配成功，其格式为数组['</div>', 'div']
            advance(endTagMatch[0].length)
            handleEndTag(endTagMatch[1])
            continue
        }
    }

    // 当第一个元素不是<，即第一个元素是文本时
    let text;
    if (textEnd >= 0) {
        // 截取文本
        text = template.substring(0, textEnd);
    }

    if (text) { // 有文本
        advance(text.length) // 去掉template上的文本，且改变template字符
        handleChars(text) // 生成文本节点
    }

   }

   // 解析开始标签
   function parseStartTag() {
        // 1. 匹配开始标签
        const start = template.match(startTagOpen)
        // start格式为数组,形如['<div', 'div']
        if (start) {
            const match = { // 初始化标签
                tagName: start[1],
                attrs: []
            }
            // 匹配到了开始标签，就把<tagName截取掉，往后继续匹配属性
            advance(start[0].length)

            // 2. 开始递归匹配标签属性
            // end代表结束符号>；如果匹配成功，格式为('>', '')
            // attr表示匹配的属性
            let end,attr;
            // 不是标签结尾，并且能匹配到属性时
            while(
                !(end = template.match(startTagClose)) &&
                (attr = template.match(attribute))
            ) {
                // attr如果匹配成功，也是一个数组，格式为：
                //   ["class=\"myClass\"", "class", "=", "myClass", undefined, undefined]
                // attr[1]为属性名，attr[3]/attr[4]/attr[5]为属性值，取决于属性定义是双引号/单引号/无引号

                // 匹配成功一个属性，就在template上截取掉该属性，继续往后匹配
                advance(attr[0].length)

                attr = {
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] //这里是因为正则捕获支持双引号（） 单引号 和无引号的属性值
                }
                match.attrs.push(attr) // 将遍历出来的属性添加到节点上
            }

            // 匹配到结尾标签
            if (end) {
                advance(1) // 代表一个标签匹配到结束的>了  代表开始标签解析完毕
                return match
            }
        }
   }

   // 截取template字符串，每次匹配到了就 往前继续匹配
   function advance(n) {
       template = template.substring(n);
   }

   return root;
}