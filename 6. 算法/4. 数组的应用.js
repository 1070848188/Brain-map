/** 
 * @description 两数求和问题
 * 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标
 * 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素
 * 示例：
 *  给定 nums = [2, 7, 11, 15], target = 9
 *  因为 nums[0] + nums[1] = 2 + 7 = 9 所以返回 [0, 1]
*/

/** 
 * @description ES5写法
 * @param {Number[]} nums
 * @param {Number} target
 * @returns {Number[]}
*/
const twoSumEs5 = function (nums, target) {
    const diffs = {}; // 用来储存已经出现过的值
    for(let i = 0, len = nums.length; i < len; i++) {
        if (diffs[target - nums[i]]) {
            return [diffs[target - nums[i]], i]
        }
        diffs[nums[i]] = i
    }
}

/** 
 * @description ES6写法
 * @param {Number[]} nums
 * @param {Number} target
 * @returns {Number[]}
*/
const twoSumEs6 = function (nums, target) {
    const map = new Map() // 用来储存已经出现过的值
    for(let i = 0, len = nums.length; i < len; i++) {
        if (map.has(target - nums[i])) {
            return [map.get(target - nums[i]), i]
        }
        map.set(nums[i], i)
    }
}

console.log(twoSumEs5([1,2,3,4,5,,6,7], 7));
console.log(twoSumEs6([1,2,3,4,5,,6,7], 5));

/** 
 * @description 双指针法
 * 描述：给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
 * 说明: 
 *  初始化 nums1 和 nums2 的元素数量分别为 m 和 n 
 *  你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
 * 示例:
 *  输入:
 *      nums1 = [1,2,3,0,0,0], m = 3
 *      nums2 = [2,5,6], n = 3
 *  输出: 
 *      [1,2,2,3,5,6]
 * 思路：
 *  可以给两个指针，都指向两个数组的有效末尾，从末尾开始互相比较，把最大的从尾部向nums1中覆盖
*/
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
 const merge = function(nums1, m, nums2, n) {
    // 初始化指针位置为最后一项  初始化nums最后一个位置
    let i = m - 1, l = n - 1, k = m + n -1;

    // 两数比较 最大的往后放
    while (1 >= 0 && l >= 0) {
        if (nums1[i] > nums2[l]) {
            nums1[k] = nums1[i]
            i--;
        } else {
            nums1[k] = nums2[l]
            l--
        }
        k--
    }
    
    // 针对nums2里面还有剩余
    while (l >= 0) {
        nums1[k] = nums1[l]
        k--
        l--
    }
    return nums1
 }

 
 console.log(merge([6,7,8,0,0,0,0], 3, [2,3,3,5], 4));


 /** 
  * 三数求和
  * 真题描述：
  *     给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c 
  *     使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
  * 注意：
  *     答案中不可以包含重复的三元组。
  * 示例：
  *     给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]
 */
function findThree(nums) {
    let arr = []
    nums.sort((a, b) => a - b) // 首先进行排序
    for (let i = 0, len = nums.length; i < len - 2; i++) {
        let l = i + 1, k = len - 1;
        while (l < k) {
            if (nums[i] + nums[l] + nums[k] > 0) { // 大于0代表右侧数较大
                k--; // 右指针左移
                // 处理两次数一样的情况
                while (l < k && nums[k] === nums [k + 1]) {
                    k--;
                }
            } else if (nums[i] + nums[l] + nums[k] < 0) { // 小于0代表左侧数较小
                l++ // 左指针右移
                // 处理两次数一样的情况
                while (l < k && nums[l] === nums [l - 1]) {
                    l--;
                }
            } else { // 三数相加等于0 可以推进数组中，但仍需继续前进指针，看是否还有
                arr.push(nums[i], nums[l], nums[k])
                l--;
                k--;
                while (l < k && nums[k] === nums [k + 1]) {
                    k--;
                }
                while (l < k && nums[l] === nums [l - 1]) {
                    l--;
                }
            }
        }
    }

    return arr
}

console.log(findThree([-1, 0, 1, 2, -1, -4]));