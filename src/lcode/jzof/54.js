/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthLargest = function(root, k) {


  const dfs = function (root) {

      console.log('root', root)

    if(!root) {
      return;
    }

    console.log(root.val);
    dfs(root.left);
    dfs(root.right);
  }


  dfs(root);
};
