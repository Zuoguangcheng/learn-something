/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
   let p = headA;
    while(p) {
      p.isMap = true;
      p = p.next;
    }

    p = headB;

    while(p) {
      if(p.isMap) {
        return p;
      }

      p = p.next;
    }

    return null;
};
