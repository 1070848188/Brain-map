// string类型
var a = 'hello ts';
console.log(a);
// 布尔类型
var bol = false;
console.log(bol);
// number类型
var num = 3;
// undefined类型
var un = undefined;
console.log(un);
/**
 *
 * @enum {number}
 */
// 普通枚举 初始值默认为 0 其余的成员会会按顺序自动增长 可以理解为数组下标
var Color;
(function (Color) {
    Color[Color["RED"] = 0] = "RED";
    Color[Color["PINK"] = 1] = "PINK";
    Color[Color["NLUE"] = 2] = "NLUE";
})(Color || (Color = {}));
console.log(Color); // { '0': 'RED', '1': 'PINK', '2': 'NLUE', RED: 0, PINK: 1, NLUE: 2 }
var pink = Color.PINK;
console.log(pink); // 1
// 初始值
(function (Color) {
    Color[Color["DEFAULT"] = 10] = "DEFAULT";
})(Color || (Color = {}));
var defaultColor = Color.DEFAULT;
console.log(defaultColor); // 10
// 字符串枚举 每个都需要声明
var Animal;
(function (Animal) {
    Animal["DOG"] = "\u72D7";
    Animal["CAT"] = "\u732B";
})(Animal || (Animal = {}));
var ani = Animal.DOG;
console.log(ani);
var people = [0 /* People.MAN */, "\u5973" /* People.WOMAN */];
console.log(people);
// 数组类型
var flag1 = [1, 2, 3];
var flag2 = [1, 23, 4];
/**
 * @name Tuple 元组
 * @descriptions 在 TypeScript 的基础类型中
 *  元组（ Tuple ）表示一个已知数量和类型的数组 其实可以理解为他是一种特殊的数组
 * */
var flag = ['2', 3, true];
/**
 * @name Symbol
 * @descriptions 我们在使用 Symbol 的时候 必须添加 es6 的编译辅助库
 *   需要在 tsconfig.json 的 libs 字段加上ES2015 Symbol 的值是唯一不变的
 * */
var sym1 = Symbol('hello');
var sym2 = Symbol('hello');
console.log(Symbol("hello") === Symbol("hello"));
