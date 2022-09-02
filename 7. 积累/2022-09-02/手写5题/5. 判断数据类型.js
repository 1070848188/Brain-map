
function getDataType (params) {
    if (params === null) {
        return 'null'
    }
    
    if (typeof params === 'object') {
        const res = Object.prototype.toString.call(params)
        return  res.split(' ').pop().slice(0, -1).toLowerCase()
    } else {
        return typeof params
    }
}

console.log(getDataType([]));
console.log(getDataType({}));
console.log(getDataType(new Date()));