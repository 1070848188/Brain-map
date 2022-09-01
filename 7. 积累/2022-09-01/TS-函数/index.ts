// 函数的定义
// 可以指定参数的类型和返回值的类型 void代表没有返回值
function hello(name: string): void {
    console.log('hello', name);
    
}
hello('old zhang')

// 函数的表达式
// 可以指定函数的入参及返回值的格式  然后在需要用到的时候指定类型
type sumFunc = (x: number, y: number) => number

let countNumber: sumFunc = function (a, b) {
    return a + b
}

// 可选参数
// 不是必穿参数的 可以给可选项
function print(name: string, age?: number): void {
    console.log(name, age);
}
print("hahaha");

// 剩余参数
// 可以将剩余参数合并到数组中指定类型
function sum(...numbers: Array<number>) {
    return numbers.reduce((val, item) => (val += item), 0);
}
console.log(sum(1, 2, 3));

/**
 * 函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力
 *      在 TypeScript 中，表现为给同一个函数提供多个函数类型定义
 * 
 * 注意：函数重载真正执行的是同名函数最后定义的函数体 在最后一个函数体定义之前全都属于函数类型定义
 *      不能写具体的函数实现方法 只能定义类型
 */
 let obj: any = {};
 function attr(val: string): void;
 function attr(val: number): void;
 function attr(val: boolean): void;
 function attr(val: any): void {
   if (typeof val === "string") {
     obj.name = val;
   } else {
     obj.age = val;
   }
 }
 attr("hahaha");
 attr(9);
 attr(true);
 console.log(obj);