/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function(head, val) {

    let left = null;
    let right = head;

    if(head.val === val) {
      return head.next;
    }


    do {
      left = right;
      right = right.next;
      if(!right) {
        return null;
      }

      if(right.val === val) {
        left.next = right.next;
        return head;
      }
    }while (true);


    return null;
};
