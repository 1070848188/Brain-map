## 1. CSS 选择器及其优先级
- id #id 100
- 类 .class 10
- 标签 div 1
- 属性选择器 input[checked=true] 10
- 伪类选择器 li:last-child 10
- 伪元素选择器  li::after 1
- 相邻兄弟选择器 h1+p
- 子选择器 ul>li
- 后代选择器 li a
- 通配符选择器 *

注意事项：

!important 声明的样式的优先级最高；
如果优先级相同，则最后出现的样式生效；
继承得到的样式的优先级最低；
通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

## 2. css不可继承属性

display：规定元素应该生成的框的类型
文本属性：
vertical-align：垂直文本对齐
text-decoration：规定添加到文本的装饰
text-shadow：文本阴影效果
white-space：空白符的处理
unicode-bidi：设置文本的方向

盒子模型的属性：width、height、margin、border、padding
背景属性：background、background-color、background-image、background-repeat、background-position、background-attachment
定位属性：float、clear、position、top、right、bottom、left、min-width、min-height、max-width、max-height、overflow、clip、z-index
生成内容属性：content、counter-reset、counter-increment
轮廓样式属性：outline-style、outline-width、outline-color、outline
页面样式属性：size、page-break-before、page-break-after
声音样式属性：pause-before、pause-after、pause、cue-before、cue-after、cue、play-during


## 3. display 的属性值及其作用

属性值	| 作用
none	| 元素不显示，并且会从文档流中移除。
bloc	| 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。
inlin	| 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。
inline-block	| 默认宽度为内容宽度，可以设置宽高，同行显示。
list-item	| 像块类型元素一样显示，并添加样式列表标记。
table	| 此元素会作为块级表格来显示。
inherit	| 规定应该从父元素继承 display 属性的值。

## 4. display 的 block、inline 和 inline-block 的区别

## 5. 隐藏元素的方法有哪些