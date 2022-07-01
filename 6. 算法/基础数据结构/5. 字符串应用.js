/**
 * @description 判断字符是否为回文
 */
function isPalindrome(str) {
    const reserverStr = str.split('').reverse().join('')
    return str === reserverStr;
}

// console.log(isPalindrome('aba'));
// console.log(isPalindrome('accbca'));

/**
 * @description 判断删除一个字符后是否为回文
 */
const validePalind = function (str) {
    let l = 0, r = str.length - 1;
    while(l < r && str[l] === str[r]) { // 循环到回文条件不成立时结束
        l++;
        r--;
    }

    if (isPalindrome(l+1, r) || isPalindrome(l, r+1)) {
        return true
    }

    function isPalindrome (l, r) { // 判断字符是否是回文
        while(l < r) {
            if (str[l] !== str[r]) { // 不相等代表不是回文
                return false
            }
            l++;
            r--;
        }
        return true;
    }

    return false
}

console.log(validePalind('abca'));