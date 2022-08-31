// string类型
const a: string = 'hello ts'
console.log(a);

// 布尔类型
const bol: boolean = false
console.log(bol);

// number类型
const num: number = 3

// undefined类型
const un: undefined = undefined
console.log(un);


/**
 *
 * @enum {number}
 */
// 普通枚举 初始值默认为 0 其余的成员会会按顺序自动增长 可以理解为数组下标
enum Color {
    RED,
    PINK,
    NLUE
}

console.log(Color); // { '0': 'RED', '1': 'PINK', '2': 'NLUE', RED: 0, PINK: 1, NLUE: 2 }
const pink: Color = Color.PINK
console.log(pink); // 1

// 初始值
enum Color {
    DEFAULT = 10
}
const defaultColor: Color = Color.DEFAULT
console.log(defaultColor); // 10

// 字符串枚举 每个都需要声明
enum Animal {
    DOG = '狗',
    CAT = '猫'
}
const ani: Animal = Animal.DOG
console.log(ani);

// 常量枚举 它是使用 const 关键字修饰的枚举，常量枚举与普通枚举的区别是
// 整个枚举会在编译阶段被删除 我们可以看下编译之后的效果
const enum People {
    MAN,
    WOMAN = '女'
}
const people: People[] = [ People.MAN, People.WOMAN ]
console.log(people);

// 数组类型
const flag1: number[] = [1,2,3]
const flag2: Array<number> = [1,23,4]

/** 
 * @name Tuple 元组
 * @descriptions 在 TypeScript 的基础类型中
 *  元组（ Tuple ）表示一个已知数量和类型的数组 其实可以理解为他是一种特殊的数组
 * */

const flag: [string, number, boolean] = [ '2', 3, true ]

/** 
 * @name Symbol
 * @descriptions 我们在使用 Symbol 的时候 必须添加 es6 的编译辅助库
 *   需要在 tsconfig.json 的 libs 字段加上ES2015 Symbol 的值是唯一不变的
 * */
// const sym1 = Symbol('hello')
// const sym2 = Symbol('hello')
// console.log(Symbol("hello") === Symbol("hello"));


// 任意类型 any
const flag3: any = document.getElementById("root");


// null和undefined
let u: undefined = undefined;
let n: null = null;


// Unknown类型
// unknown类型只能被赋值给 any 类型和 unknown 类型本身 而 any 啥都能分配和被分配
let value: unknown;

value = 1
value = true
value = '22'

const a1: unknown = value
const a2: any = value
// const a3: number = value // Error

// void类型
// void 表示没有任何类型 当一个函数没有返回值时 TS 会认为它的返回值是 void 类型。
// 申明为 void 类型的变量，只能赋予 undefined 和 null
function hello (name: number): void {}


// never类型
// never 一般表示用户无法达到的类型 例如never 类型
//      是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型
// never 类型表示永远不会有值的一种类型。(很抽象是不是)
function neverReach(): never {
    throw new Error("an error");
}

// BigInt 大数类型
const max1 = Number.MAX_SAFE_INTEGER; // 2**53-1
console.log(max1 + 1 === max1 + 2); //true

const max2 = BigInt(Number.MAX_SAFE_INTEGER);
// console.log(max2 + 1n === max2 + 2n); //false

let foo: number;
let bar: bigint;
// foo = bar; //error
// bar = foo; //error

// object，Object和{}类型

// object 类型用于表示非原始类型
let objCase: object
// objCase = 1; // error
// objCase = "a"; // error
// objCase = true; // error
// objCase = null; // error
// objCase = undefined; // error
objCase = {}; // ok

// 大 Object 代表所有拥有 toString、hasOwnProperty 方法的类型 所以所有原始类型
//      非原始类型都可以赋给 Object(严格模式下 null 和 undefined 不可以)
let ObjectCase: Object;
ObjectCase = 1; // ok
ObjectCase = "a"; // ok
ObjectCase = true; // ok
// ObjectCase = null; // error
// ObjectCase = undefined; // error
ObjectCase = {}; // ok

// {} 空对象类型和大 Object 一样 也是表示原始类型和非原始类型的集合
let simpleCase: {};
simpleCase = 1; // ok
simpleCase = "a"; // ok
simpleCase = true; // ok
// simpleCase = null; // error
// simpleCase = undefined; // error
simpleCase = {}; // ok

// 类型推论
// 指编程语言中能够自动推导出值的类型的能力 它是一些强静态类型语言中出现的特性 
//    定义时未赋值就会推论成 any 类型 如果定义的时候就赋值就能利用到类型推论
let flag4; //推断为any
let count = 123; //为number类型
let hello2 = "hello"; //为string类型

// 联合类型
// 联合类型（Union Types）表示取值可以为多种类型中的一种 未赋值时联合类型上只能访问两个类型共有的属性和方法
let name2: string | number;
// console.log(name2.toString()); // error
name2 = 1;
console.log(name2.toFixed(2));
name2 = "hello";
console.log(name2.length);

// 类型断言
// 你会比 TypeScript 更了解某个值的详细信息。通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型
// 其实就是你需要手动告诉 ts 就按照你断言的那个类型通过编译
let someValue: any = [2]
let strLength: number = (<Array<Number>>someValue).length

// 尖括号 语法
let someValue1: any = "this is a string";
let strLength1: number = (<string>someValue).length;

// as 语法
let someValue2: any = "this is a string";
let strLength2: number = (someValue as string).length;

// 非空断言
// 非空断言 在上下文中当类型检查器无法断定类型时 一个新的后缀表达式操作符 !
//          可以用于断言操作对象是非 null 和非 undefined 类型
let flag5: null | undefined | string;
flag!.toString(); // ok
// flag.toString(); // error

// 类型别名
// 类型别名用来给一个类型起个新名字
type flag = string | number;

function hello24(value: flag) {}

// 交叉类型
// 交叉类型是将多个类型合并为一个类型。通过 & 运算符可以将现有的多种类型叠加到一起成为一种类型
// 它包含了所需的所有类型的特性
type Flag1 = { x: number };
type Flag2 = Flag1 & { y: string };
type Flag3 = Flag2 & { henb: number };

let flag32: Flag3 = {
  x: 1,
  y: "hello",
  henb: 2,
};


//  类型保护 其实我理解就是检测数据类型的
// 类型保护就是一些表达式，他们在编译的时候就能通过类型信息确保某个作用域内变量的类型
//  其主要思想是尝试检测属性、方法或原型，以确定如何处理值

// typeof 类型保护
function double(input: string | number | boolean) {
    if (typeof input === "string") {
      return input + input;
    } else {
      if (typeof input === "number") {
        return input * 2;
      } else {
        return !input;
      }
    }
  }

//   in 关键字
interface Bird {
fly: number;
}

interface Dog {
leg: number;
}

function getNumber(value: Bird | Dog) {
    if ("fly" in value) {
        return value.fly;
    }
    return value.leg;
}

// instanceof 类型保护
class Animals {
    name!: string;
}
class Bird extends Animals {
    fly!: number;
}
function getName(animal: Animals) {
    if (animal instanceof Bird) {
        console.log(animal.fly);
    } else {
        console.log(animal.name);
    }
}

// 自定义类型保护
// 通过 type is xxx这样的类型谓词来进行类型保护
function isObject(value: unknown): value is object {
    return typeof value === "object" && value !== null;
}

function fn(x: string | object) {
    if (isObject(x)) {
        // ....
    } else {
        // .....
    }
}