function myInstanceof (left, right) {

    while (left.__proto__) { // 如果left一直存在原型链则可以继续遍历
        if (left.__proto__ === right.prototype) {
            return true
        } else {
            left = left.__proto__ || {}
        }
    }

    return false
}

console.log(myInstanceof(1, Array));
console.log(myInstanceof(1, Number));
