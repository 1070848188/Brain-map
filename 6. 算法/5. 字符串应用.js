/**
 * @description 判断字符是否为回文
 */
function isPalindrome(str) {
    const reserverStr = str.split('').reverse().join('')
    return str === reserverStr;
}

console.log(isPalindrome('aba'));
console.log(isPalindrome('accbca'));

const validPalindrome = str => {
    let len = str.length;
}