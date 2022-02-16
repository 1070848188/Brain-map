/**
 * @description 
 *  1. 求水仙花数  （自行百度什么是水仙花数）
 */


for(var i = 100; i < 1000; i++) { // 因为是三位数  从100开始  到999结束
    // 获取百位数 i / 100 取整数位得到百位数
    var a = parseInt(i / 100)
    var b = i % 100 // i % 100 取余  获取到十分位和个分位
    var c = parseInt(b / 10) // b / 10 取整 获取到十分位
    var d = b % 10 // 取余获取到百分位
    if (i === (a*a*a + c*c*c + d*d*d)) {
        console.log(i);
    }
}