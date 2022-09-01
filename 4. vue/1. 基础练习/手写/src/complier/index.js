import { parse } from './parse'
import { generate } from './codegen'

/** 
 * complieToFunctions函数一共分成四个步骤：
 * 1. parse： 把tempalte转成AST语法树
 * 2. optimize： 优化静态节点
 * 3. generate：通过ast，重新生成代码
 * 4. 通过new Function生成函数
*/
export function complieToFunctions(template) {
    let ast = parse(template)

    let code = generate(ast);

    console.log(code);

    let renderFn = new Function(`with(this){ return ${code} }`)
    
    return renderFn
}