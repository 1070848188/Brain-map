// 题目描述:setinterval 用来实现循环定时调用 可能会存在一定的问题 能用 settimeout 解决吗
const myInterval = (...params) => {
    const [ callBack, time, ...arg ] = params;
    let timer = null;
    function interval() {
        timer = setTimeout(() => { callBack(); interval() }, time);
    }
    interval()
    return {
        clear: () => {
            clearTimeout(timer)
        }
    }
}

let conuts = 0

count.innerHTML = conuts

let timer;

start.addEventListener('click', e => {
    timer && clearInterval(timer)
    timer = myInterval((a, b) => {
        conuts++
        count.innerHTML = conuts
    }, 1000, 2, 3);
})

end.addEventListener('click', e => timer.clear())

