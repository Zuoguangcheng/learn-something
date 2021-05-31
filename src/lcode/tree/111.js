/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */

var minDepth = function(root) {
    if(!root) {
      return 0;
    }

    let leftDepth = 1 + minDepth(root.left);
    let rightDepth = 1 + minDepth(root.right);


    if(!(leftDepth - 1)) {
      return rightDepth
    }

    if(!(rightDepth - 1)) {
      return leftDepth;
    }

    return Math.min(leftDepth, rightDepth);
};
