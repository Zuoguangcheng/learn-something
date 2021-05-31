/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
const isPalindrome = function(head) {
    let stack = [];

    let p = head;
    while (p) {
      stack.push(p.val);
      p = p.next;
    }

    while (stack.length) {
      if(stack.length === 1) {
        return true
      }
      if(stack.pop() !== stack.shift()) {
        return false;
      }
    }

    return true
};
