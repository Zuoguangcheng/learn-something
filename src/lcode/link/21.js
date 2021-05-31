/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  let p1 = l1;
  let p2 = l2;
  let p3 = new ListNode();
  let p4 = p3;


  while (p1 && p2) {
    if(p1.val < p2.val) {
      p3.next = p1;
      p3 = p3.next;
      p1 = p1.next;
    }else {
      p3.next = p2;
      p3 =p3.next;
      p2 = p2.next;
    }
  }

  if(p1) {
    p3.next = p1;
  }

  if(p2) {
    p3.next = p2;
  }

  return p4.next;
};
