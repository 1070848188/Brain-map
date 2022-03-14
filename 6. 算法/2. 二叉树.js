/**
 * @description 二叉树
 */
const obj = {
    val: '1',
    left: {
        val: '1-l',
        left: {
            val: '1-l-1'
        },
        right: {
            val: '1-l-2'
        }
    },
    right: {
        val: '1-r',
        right: {
            val: '1-r-1'
        }
    }
}
console.log(obj);

// 先序遍历
function pre(treeObj) {
    if (!treeObj) return;

    console.log(`当前遍历的是值为：${treeObj.val}`);
    pre(treeObj.left)


    pre(treeObj.right)
}
console.log('先序遍历---------------------------');
pre(obj)
console.log('-------------------------------------');
// 中序遍历
// =》 左1进来 =》 左1-l-1进函数 =》 下一个结束 =》 打印1-l-1 =》 打印1-l =》 右侧进递归 =》 1-l-2 =》 最后1
function inorder(treeObj) {
    if (!treeObj) return;

    inorder(treeObj.left)

    console.log(`当前遍历的是值为：${treeObj.val}`);
    
    inorder(treeObj.right)
}

console.log('中序遍历---------------------------');
inorder(obj)
console.log('-------------------------------------');

// 后序遍历
function last(treeObj) {
    if (!treeObj) return;

    last(treeObj.left)
    last(treeObj.right)
    console.log(`当前遍历的是值为：${treeObj.val}`);
}

console.log('后序遍历---------------------------');
last(obj)
console.log('-------------------------------------');
