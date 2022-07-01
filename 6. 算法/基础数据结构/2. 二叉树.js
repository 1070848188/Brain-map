/**
 * @description 二叉树创建函数
 */
function TreeNode (val) {
    this.val = val;
    this.left = this.right = null;
}

const root = new TreeNode('A'); // 根节点
const node1 = new TreeNode('B'); // 左子树
const node2 = new TreeNode('C'); // 右子树
root.left = node1;
root.right = node2;
// 左子树扩展
node1.left = { val: 'D' }
node1.right = { val: 'E' }
// 右子树扩展
node2.right = { val: 'F' }

console.log(root);


/**
 * @description 二叉树遍历
 */

console.log('------------先序遍历');

// 先序遍历 遍历顺序是 根节点 =》左子树 =》右子树
function firstFor(node) {
    if (!node) return // 递归边界
    console.log(node.val); // 当前递归值
    firstFor(node.left)
    firstFor(node.right)
}

firstFor(root)

console.log('------------中序遍历');

// 中序遍历 遍历顺序是 左子树 =》根节点 =》右子树
function centerFor(node) {
    if (!node) return // 递归边界
    centerFor(node.left)
    console.log(node.val); // 当前递归值
    centerFor(node.right)
}

centerFor(root)

console.log('------------后序遍历');

// 中序遍历 遍历顺序是 左子树 =》右子树 =》根节点
function lastFor(node) {
    if (!node) return // 递归边界
    lastFor(node.left)
    lastFor(node.right)
    console.log(node.val); // 当前递归值
}

lastFor(root)