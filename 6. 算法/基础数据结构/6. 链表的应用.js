class ListNode {
    constructor (val) {
        this.next = null;
        this.val = val;
    }
}

function getList(arr) {
    let node = new ListNode()
    arr.reduce((cur, now) => {
        const newNode = new ListNode(now)
        cur.next = newNode
        return newNode
    }, node);
    return node.next;
}


/** 链表合并
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
 const mergeTwoLists = function(l1, l2) {
    // 创建头节点
    const head = new ListNode();
    let cur = head; // 针头
    while(l1 && l2) {
        if (l1.val <= l2.val) { // 两个链表头比较
            cur.next = l1; // 将较小数串起来
            l1 = l1.next; // 前进一步
        } else {
            cur.next = l2; // 将较小数串起来
            l2 = l2.next; // 前进一步
        }
        cur = cur.next; // 针也向前一步
    }
    // 若还有剩余
    cur.next = l1 ? l1 : l2;
    return head.next;
 }

/** 链表去重
 * @param {ListNode} head
 * @return {ListNode}
 */
 function delNode(head) {
    let cur = head; // 初始节点为起点
    while(cur !== null && cur.next !== null) {
        // 第一个数与后一个数相等
        if (cur.val === cur.next.val) {
            cur.next = cur.next.next // 删除第二个数
        } else {
            cur = cur.next // 不相等，继续遍历
        }
    }
    return head;
 }


/** 删除所有重复数据
 * @param {ListNode} head
 * @return {ListNode}
 */
 function deleteDuplicates (head) {
    const dummy = new ListNode(); // 前驱节点
    dummy.next = head; // 链接链表
    let cur = dummy; // 开始从前驱节点遍历
    while(cur.next && cur.next.next) { // 至少后面有两个节点
        if (cur.next.val === cur.next.next.val) {
            const num = cur.next.val; // 记录这个值
            while(cur.next && cur.next.val === num) { // 反复遍历找到相同的值
                cur.next = cur.next.next // 删除当前节点
            }
        } else {
            cur = cur.next; // 不重复就继续遍历
        }
    }
    return dummy.next;
 }

 /** 删除倒数第n个节点
 * @param {ListNode} head
 * @param {Number} n
 * @return {ListNode}
 */
var removeNthFromEnd  = function(head, n) {
    const dummy = new ListNode() // 前置节点 用于遍历
    dummy.next = head; // 形成链表
    let l = dummy, r = dummy;
    while(n > 0) { // 快指针先走n步
        r = r.next;
        n--;
    }
    while(r.next) { // 快指针到最后一个节点
        l = l.next;
        r = r.next;
    }
    // 删除慢指针后指定节点
    l.next = l.next.next;
    return dummy.next;
};

 /** 链表反转
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList  = function(head) {
    let pre = null // 前驱节点初始化
    let cur = head // 目标节点从头开始
    while(cur) {
        const next = cur.next; // 记录后续节点
        cur.next = pre; // 反转
        pre = cur; // 前驱节点前进
        cur = next; // 目标节点前进
    }
    return pre
};

 /** 局部反转
 * @param {ListNode} head
 * @param {Number} m
 * @param {Number} n
 * * @return {ListNode}
 */
const reverseBetween = function(head, m, n)  {
    const dummy = new ListNode();
    dummy.next = head;
    let p = dummy; // 拼接前驱节点
    for(let i = 0;i<m -1;i++) {
        p = p.next; // 遍历找到反转前驱节点
    }
    let first = p; // 记录反转前节点
    let last = p.next;
    // 以下为反转
    let pre = p.next; // 前驱节点
    let cur = p.next.next; // 当前需要反转节点
    for(let i = m; i < n;i++) {
        const next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    first.next  = pre;
    last.next = cur;
    return dummy.next
};

console.log(reverseBetween(getList([1,2,3,4,5,6,7,8]), 4, 7));