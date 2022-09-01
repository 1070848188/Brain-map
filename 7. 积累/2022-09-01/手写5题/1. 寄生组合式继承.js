// 父类
function Parent (name, age, obj) {
    this.name = name
    this.age = age
    this.obj = obj
    this.list = [1, 2, 3]
}

// 首先了解构造函数，实例化对象，原型对象间的关系
const parents = new Parent('父', 50, { name: '张三', say: x => (console.log(x)) })

console.log(parents.__proto__ === Parent.prototype); // 实例化对象的__proto__属性指向构造函数原型对象
console.log(parents.__proto__.constructor === Parent); // 原型对象的constructor指向构造函数
console.log(parents.constructor === Parent); // 实例化对象寻找constructor属性  找不到 就往原型上找

Parent.prototype.s = 222

// 类上的属性分为  私有属性和公有属性
//  - 私有属性 非原型上的属性
//  - 公有属性 原型上的属性

// 继承 =》 就是让子类继承父类所有的属性及方法，但是又是独立分开的，互不影响

// 1. 私有属性继承 使用call改变父类构造函数执行时的this
//  缺点： 只是继承了私有属性，并没有继承实例上的属性
// function Song (...params) {
    // this.arr = [4, 5, 6]
//     Parent.call(this, ...params)
// }

// const song = new Song('子', 25, { a: 1, b: 2 })
// const parents1 = new Parent('父', 50, { name: '张三', say: x => (console.log(x)) })
// console.log(song, parents1);

// 2. 公有属性继承
// 缺点： 跟父类公有属性强耦合，且未继承私有属性
// function Song () {
//     this.arr = [4, 5, 6]
// }
// Song.prototype = Parent.prototype
// Song.prototype.constructor = Song

// const song1 = new Song('子', 25, { a: 1, b: 2 })
// const parents2 = new Parent('父', 50, { name: '张三', say: x => (console.log(x)) })

// Parent.prototype.v = 555
// Song.prototype.x = 666


// console.log(song1);
// console.log(song1.s, song1.v, song1.x);
// console.log(parents2.s, parents2.v, parents2.x);

// 3. 寄生组合式继承

function Song (...params) {
    Parent.call(this, ...params)
    this.arr = [4, 5, 6]
}

Song.prototype = Object.create(Parent.prototype)
Song.prototype.constructor = Song

const song1 = new Song('子', 25, { a: 1, b: 2 })
const parents2 = new Parent('父', 50, { name: '张三', say: x => (console.log(x)) })

// 公有属性改变是否影响
Parent.prototype.x = 666

console.log(song1.x, parents2.x);