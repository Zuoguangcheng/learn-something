/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head) {
    const list = [];

    let node = head;
    while (node) {
        list.unshift(node.val);
        node = node.next;
    }

    return list;
};
