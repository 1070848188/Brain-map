
// 题目一
// const p = new Promise((resolve, reject) => {
//     console.log(1)
//     resolve()
// }).then(res => { // 执行then方法 没有返回值 则
//     console.log(2);
//     new Promise((resolve, reject) => {
//         console.log(4);
//         resolve()
//     }).then(res => {
//         console.log(5);
//     }).then(res => {
//         console.log(6);
//     })
// }).then(res => {
//     console.log(3);
// })
// console.log(p);

// 题目二
/** 
 *   执行栈  微任务队列  宏任务队列
 *      0      微任务1
 *      1
*/
// Promise.resolve().then(() => {
//     console.log(0);
//     return Promise.resolve(4);
// }).then((res) => {
//     console.log(res) // 微任务1
// })

// Promise.resolve().then(() => {
//     console.log(1);
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(5);
// }).then(() =>{
//     console.log(6);
// })

// setTimeout(() => {
//     console.log(333);    
// }, 0);

const MyPromise = require('./promise')

const p = new MyPromise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
        resolve('success')
        reject('err')
    }, 1000);
})

const p2 = p.then(res => {
    console.log(1, res);
    return 3
}, reason => {
    console.log(reason);
})
p2.then(res => {
    console.log(222, res);
})

// p.then(res => {
//     console.log(2, res);
// }, reason => {
//     console.log(reason);
// })

// p.then(res => {
//     console.log(3, res);
// }, reason => {
//     console.log(reason);
// })

// const p2 = new Promise((resolve, reject) => {
//     console.log(1);
//     // resolve(2)
// })
// console.log(p2);

// let p = new MyPromise(null)