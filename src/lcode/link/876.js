/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function(head) {
  var slow = head;
  var fast = head;


  while(fast) {
    if(!fast.next) {
    //  奇数
      return slow;
    }

    if(fast.next && !fast.next.next) {
    //   偶数
      return slow.next;
    }
    fast = fast.next.next;
    slow = slow.next;
  }
};
