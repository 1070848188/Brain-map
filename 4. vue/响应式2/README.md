# 基本原理

使用defineProperty数据劫持，get时收集依赖，set时更新依赖的更新函数  实现数据响应式

# 响应式相关实现

## Vue

实现一个Vue类，主要用来暴露给用户使用，主要参数：
- el - 根元素节点
- data - 需要实现响应式的数据对象
- methods - 触发事件的函数

## Oberver

Oberver类主要用来实现数据响应式，进行数据拦截，遍历传入对象并使用defineProperty进行拦截
- obj - 需要实现响应式的数据

## Compilt

Compilt类主要用来进行数据模板的编译工作，以及指令的实现

- el - 根元素节点
- vm - 当前使用的Vue实例

## Watcher

Watcher类主要用于创建订阅者，对某个数据进行监听，在数据发生改变时，重新渲染页面

- vm - 当前使用的Vue实例
- key - 需要订阅的属性
- cb - 更新渲染的函数

## Dep

Dep类主要用于收集所有依赖，将某个属性在页面所有依赖收集起来，当数据发生变化时，通知所有watcher进行更新


# 整体流程

1. 初始化Vue, 传入options参， 主要包含el, data
2. 调用Oberver类，将data中的数据实现响应式并将数据代理到Vue类上
3. 在数据响应式时，实例化Dep类，初始化依赖数组，等待Watcher的添加
4. 调用Complit类，识别模板({{}})和指令，渲染到页面中
5. 在Complit类进行DOM操作更新时，创建Watcher类收集更新依赖
6. 在创建Watcher类时，内部进行属性调用，触发get函数，将当前Watcher挂载到Dep.target属性上
        并添加到当前属性的dep依赖数组中，之后重置Dep.target为null

以上流程完成后：

当数据发生改变：触发set方法，遍历dep中的所有watcher.update方法进行页面的更新，所有依赖此数据的dom都会发生变化