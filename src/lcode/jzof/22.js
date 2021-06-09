/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function(head, k) {
  let p = head;
  let q = head;

  while (k > 1) {
    p = p.next;
    k--;
  }

  while (p.next) {
    p = p.next;
    q = q.next;
  }

  return q;
};
