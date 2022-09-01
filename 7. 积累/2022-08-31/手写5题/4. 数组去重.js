const arr1 = [1, 2, 3, 4, 5, 3, 23, 3, 6, 4, 2, 3, 4, 5]

const uniqueArr = list => Array.from(new Set(list))

console.log(uniqueArr(arr1));