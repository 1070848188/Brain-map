/**
 * @description 要求
 *  addTask(1000,"1");
    addTask(500,"2");
    addTask(300,"3");
    addTask(400,"4");
    的输出顺序是：2 3 1 4

    整个的完整执行流程：

    一开始1、2两个任务开始执行
    500ms时，2任务执行完毕，输出2，任务3开始执行
    800ms时，3任务执行完毕，输出3，任务4开始执行
    1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
    1200ms时，4任务执行完毕，输出4
*/

class Scheduler {
    constructor (limit) {
        this.events = [] // 事件队列
        this.max = limit // 最大并行个数
        this.nowLength = 0 // 当前执行个数
    }

    add (time, num) { // 添加队列事件
        const pro = () => { // 添加但不立即执行
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log(num);
                    resolve()
                }, time);
            })
        }
        this.events.push(pro)
    }

    taskStart() { // 队列开始执行
        for (let index = 0; index < this.max; index++) {
            this.qurest() // 从队列中取出执行函数并执行
        }
    }

    qurest() {
        // 队列中没有函数了 或者 当前执行数已经抵达最大数则不执行
        if (this.events.length === 0 || this.nowLength >= this.max) return
        this.nowLength++
        this.events.shift()().then(() => {
            this.nowLength--
            this.qurest()
        })
    }
}

const scheduler = new Scheduler(2); // 创建执行队列，传入需要并行的个数
const addTask = (time, order) => { // 返回一个添加队列事件方法
  scheduler.add(time, order);
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();