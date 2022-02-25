import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',
    output: {
        format: 'umd', // 支持amd和commonjs规范
        name: 'Vue',
        file: 'dist/vue.js', // 打包后出口文件
        sourcemap: true // 支持源码阅读
    },
    plugins: [
        babel({ // 使用babel进行转化，但是排除node_modules文件
            exclude: 'node_modules/**'
        }),
        // 在dev环境下开启一个3000端口的服务
        process.env.ENV === 'development'
            ? serve({
                   open: true,
                   openPage: '/public/index.html',
                   port: 3000,
                   contentBase: '' 
                })
                : null
    ]
}