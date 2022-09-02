// 函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时
// 这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求。
const func = debounce(e => {
    console.log('触发了点击');
}, 600)

deb.addEventListener('click', func)

function debounce (fun, time) {
    let timer = null
    return function () {
        const context = this,
        args = arguments;

        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    
        timer = setTimeout(() => {
            fun.apply(context, args)
        }, time);
    }
}