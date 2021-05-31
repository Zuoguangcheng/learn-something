/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
const mirrorTree = function(root) {

  if(!root) {
    return null;
  }

  const left = root.left;

  root.left = root.right;
  root.right = left;

  mirrorTree(root.left);
  mirrorTree(root.right);

    return root;

};
