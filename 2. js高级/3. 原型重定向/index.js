/**
 * @description 需求
 *  批量给构造函数原型对象添加方法
 */

// 
function fun() {
    this.a = 0

    this.b = function() {
        console.log(this.a);
    }
}

// 1. 第一种方法 原型对象上只有constructor方法
fun.prototype = { // 直接重定向
    b: function() {
        this.a = 20
        console.log(this.a);
    },
    c: function() {
        this.a = 30
        console.log(this.a);
    }
}

fun.prototype.constructor = fun // 手动重置constructor

// 1. 第二种方法 原型对象上有多个方法
fun.prototype = {
    ...fun.prototype,
    ...{
        a: function (){}
    }
}

function c(a, b, c, d, e) {

}
console.log(c.name);
console.log(c.length);