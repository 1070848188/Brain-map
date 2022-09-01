// es6
const flatter = list => list.flat(Infinity)

// 0.1
const flatter2 = list => {
    const newList = [];
    function pushItem (arr) {
        arr.forEach(item => Array.isArray(item) ? pushItem(item) : newList.push(item))
    }

    pushItem(list)

    return newList
}

// 0.2
const flatter3 = list =>
    list.reduce((pre, cur) =>
        Array.isArray(cur) ? [...pre,  ...flatter3(cur)] : [...pre,  cur], [])


console.log(flatter([1, 2, [1, [2, 3, [4, 5, [6]]]]]))
console.log(flatter2([1, 2, [1, [2, 3, [4, 5, [6]]]]]))
console.log(flatter3([1, 2, [1, [2, 3, [4, 5, [6]]]]]))