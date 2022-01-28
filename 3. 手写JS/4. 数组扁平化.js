// 多维数组变为一维数组

const arr = [1, 2, [3, [4, 5, 6, [7], 8], 9, 10], 11, 12];
function myFlot (list) {
    if (!Array.isArray(list)) return list
    const newArr = []
    function flot(arrs) {
        arrs.forEach(l => {
            Array.isArray(l) ? flot(l) : newArr.push(l)
        });
    }
    flot(list)
    return newArr
}
console.log(myFlot(arr));