/** 
 * @description 继承
 *  + 原型继承
 *  + call继承
 *  + 寄生组合继承
 *  + 寄生组合继承兼容
*/

function Parent() {
    this.x = 100
}

Parent.prototype.getX = function getX() {
    return this.x
}

function Child() {
    /** 
     * @description call继承
     *  将父类当做普通函数执行，并改变其this指向，让函数内私有属性都挂到子类实例上
     *  缺点： 只继承私有属性
    */
    Parent.call(this)

    this.y = 200
}

/** 
 * @description 原型继承
 *  直接将子类原型对象指向父类实例对象,那么父类的私有及公有属性都变为子类的公有属性
 *  缺点： 私有公有属性不分离
*/
// Child.prototype = new Parent()

/** 
 * @description 寄生组合
 *  在call基础上扩展公有属性的继承
 *  缺点： 不兼容IE低版本浏览器
*/
// Child.prototype.__proto__ = Parent.prototype

// 改进版 利用Object.create方法 会创建一个对象，并将对象的__proto__指向入参的原理
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

Child.prototype.getY = function getY() {
    return this.y
}

const c = new Child()

console.log(c);