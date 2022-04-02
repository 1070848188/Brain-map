/**
 * @description 异步执行
 */
// 1.
// const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     console.log(2);
// });
// promise.then(() => {
//     console.log(3);
// });
// console.log(4);

// 2.
// const promise1 = new Promise((resolve, reject) => {
//     console.log('promise1')
//     resolve('resolve1')
// })
// const promise2 = promise1.then(res => {
//     console.log(res)
// })
// console.log('1', promise1);
// console.log('2', promise2);

// 3.
// const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     setTimeout(() => {
//       console.log("timerStart");
//       resolve("success");
//       console.log("timerEnd");
//     }, 0);
//     console.log(2);
//   });
//   promise.then((res) => {
//     console.log(res);
//   });
//   console.log(4);

// 4.
// Promise.resolve().then(() => {
//     console.log('promise1');
//     const timer2 = setTimeout(() => {
//         console.log('timer2')
//     }, 0)
// });
// const timer1 = setTimeout(() => {
//     console.log('timer1')
//     Promise.resolve().then(() => {
//         console.log('promise2')
//     })
// }, 0)
// console.log('start');

// 5. 
// const promise = new Promise((resolve, reject) => {
//     resolve('success1');
//     reject('error');
//     resolve('success2');
// });
// promise.then((res) => {
//     console.log('then:', res);
// }).catch((err) => {
//     console.log('catch:', err);
// })

// 6. 
// Promise.resolve(1)
//     .then(2)
//     .then(Promise.resolve(3))
//     .then(console.log)

// this

// function foo() {
//     console.log(this.a);
// }

// function doFoo() {
//     foo();
// }

// var obj = {
//     a: 1,
//     doFoo: doFoo
// };

// var a = 2;
// obj.doFoo()


// 2.
// var a = 10
// var obj = {
//   a: 20,
//   say: () => {
//     console.log(this.a)
//   }
// }
// obj.say() 

// var anotherObj = { a: 30 } 
// obj.say.apply(anotherObj) 


// 3.
// function a() {
//     console.log(this);
// }
// a.call(null);