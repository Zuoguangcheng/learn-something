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
 * @return {boolean}
 */
var isBalanced = function(root) {
  if(!root || root.length === 0) {
    return true
  }

  function dfs(root) {
    if(root === null) {
      return 0
    }

    const leftHeight = dfs(root.left);
    const rightHeight = dfs(root.right);
    console.log('root', root);
    console.log('leftHeight', leftHeight);
    console.log('rightHeight', rightHeight);

    if(leftHeight === false || rightHeight === false || Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  const a = dfs(root);
  console.log('a', a);
  return a;
};
