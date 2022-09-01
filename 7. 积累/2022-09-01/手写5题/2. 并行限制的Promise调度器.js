/** 
 * 实现有并行限制的 Promise 调度器
 * 题目描述:JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个
    addTask(1000,"1");
    addTask(500,"2");
    addTask(300,"3");
    addTask(400,"4");
    的输出顺序是：2 3 1 4
*/

/**
 *  整个的完整执行流程：
        一开始1、2两个任务开始执行
        500ms时，2任务执行完毕，输出2，任务3开始执行
        800ms时，3任务执行完毕，输出3，任务4开始执行
        1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
        1200ms时，4任务执行完毕，输出4
 */


class Scheduler {
    constructor(limit) {
        this.stack = []
        this.count = 0
        this.limit = limit
    }

    add(time, str) {
        this.stack.push(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log(str);
                    resolve()
                }, time);
            })
        })
    }

    start() {
        for (let fun = 0; fun < this.limit; fun++) {
            this.quale()
        }
    }

    quale () {
        if (!this.limit || this.count >= this.limit || !this.stack.length) return
        this.count++
        this.stack.shift()().then(res => {
            this.count--
            this.quale()
        })
    }
}

const sched = new Scheduler(2);

const addTask = (time, str) => {
    sched.add(time, str)
}

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

sched.start()
