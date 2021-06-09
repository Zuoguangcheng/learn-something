/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
  const left = root;
  const right = root;


  let loop = function (left, right) {
      if(!left && !right) {
        return true;
      }else if(!left || !right) {
        return false;
      }

      return (left.val === right.val) && loop(left.left, right.right) && loop(left.right, right.left);
  }

  return loop(left, right)
};
