/** 
 * @description 时间复杂度
 * 下面这个函数会被执行多少次?
 * T(n) = 1 + n + 1 + (n+1) + n = 3n + 3
 * => 时间复杂度只关心最内层循环的次数 所以本函数的时间复杂度为console.log(arr[i])的次数
 *  O(n)
*/
function traverse(arr) {
    var len = arr.length
    for(var i=0;i<len;i++) {
        console.log(arr[i])
    }
}
// T(n) = 1 + 1 + (n+1) + n + n + n + n*(n+1) + n*n + n*n
//        = 3 + 5n + 3n^2
// O(n^2)
function traverse(arr) {
    var outLen = arr.length // 1

    for(var i=0;i<outLen;i++) {
        // 1    n+1  n
        var inLen = arr[i].length // n

        for(var j=0;j<inLen;j++) { 
            // n    n*(n+1)  n*n
            console.log(arr[i][j]) // n*n
        }
    }
}


/** 
 * 空间复杂度
 * 这个函数中有三个变量 len,i,arr | 除了这三个遍历会开辟内存，其他的都是时间的开销
 * 并不会再增加新的变量所以这个函数的空间复杂度为O(1)
*/
function traverse(arr) {
    var len = arr.length
    for(var i=0;i<len;i++) {
        console.log(arr[i])
    }
}
// 此函数中三个变量 n,arr,i 但是arr并不是一成不变的，它会随遍历的次数一直增大
// 所以它的空间复杂度为O(n)
function init(n) {
    var arr = []
    for(var i=0;i<n;i++) {
        arr[i] = i
    }
    return arr
}