/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {

  var p = head;

  while(p && p.val === val) {
    p = head = head.next || null;

  }

  while(p && p.next) {
    if(p.next.val === val) {
      p.next = p.next.next
    }else {
      p = p.next;
    }
  }

  return head;

};
