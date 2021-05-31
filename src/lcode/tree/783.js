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
var minDiffInBST = function(root) {

  let min = null;
  let pre = null;

  const inorder = (root) => {
    if(!root) {
      return 0;
    }

    inorder(root.left);

    if(pre){
        min = min ? Math.min(Math.abs(root.val - pre), min) : Math.abs(root.val - pre);
    }

    pre = root.val;
    inorder(root.right);
  }

  inorder(root, 0);
  return min;
};
