/**
 * @description
 *      函数数据类型
 *          + 普通函数 （实名或匿名函数）
 *          + 箭头函数
 *          + 构造函数/类
 *          + 生成器函数 Generator
 *          + ...
 * 
 *      不具备prototype的函数
 *          + 箭头函数
 *          + 基于ES6给对象某个成员赋值函数值的快捷操作
 */
// 
let obj = {
    fn1: function () {
        // 具备 prototype
    },
    fn2() {
        // 不具备 prototype
    }
}

class Fn {
    fn () { } // 这样也不具备
}

console.dir(Fn)

/** 
 * @description 每一个对象数据类型的值都具备一个属性 “__proto__” 原型链/隐式原型prototype
 *  对象数据类型值
 *      + 普通对象
 *      + 特殊对象： 数组 正则  日期 Math Error
 *      + 函数对象
 *      + 实例对象
 *      + 构造函数.prototype
 *      + ...
*/

const arr = [10, 20, 30]

console.log(arr.__proto__ === Array.prototype);

console.log(Array.prototype.constructor === Array);

console.log(([]).__proto__ === Array.prototype);
/** 
 * [[scope]]: --
 * 
 * 构造函数.prototype => 指向原型对象
 * 原型对象.constructor => Array构造函数
 * 实例化对象.__proto__ => 构造函数.prototype
 *  Array (提供多个原型上的方法: concat  filter  forEach)
 * 
*/


/**
 * 原型链访问
 *  私有属性中是否存在 => 默认基于__proto__找到所属类prototype属性
 *          => 如果所属类中也没有 => 基于类.prototype.__proto__网上找
 *              => 直到Object类  => 最后到null
 *  
 */