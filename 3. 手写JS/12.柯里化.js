/** 
 * @description 
 *  柯里化就是可以把参数分开传递 可以单一传，也可以部分传，也可以全部传
 *      直到参数到达规定数量，才执行
*/

/** 
 * @description 柯里化函数
 * @param fn   所需柯里化的函数
 * @param len  参数个数
 * @param args 已接收参数列表
*/
function _curry (fn, len = fn.length, ...args) {
    return function (...params) {
        let _args = [...args, ...params];
        if (_args.length >= len) {
            return fn.apply(this, _args)
        } else {
            return _curry.call(this, fn, len, ..._args)
        }
    }
}

const print = _curry((a,b,c,d,e,f) => {
    console.log(a,b,c,d,e,f);
})

print(1,2,3,4,5,6,7)
print(1)(2,3)(4,5)(6)
print(3)(2,3,4,5,6,7)