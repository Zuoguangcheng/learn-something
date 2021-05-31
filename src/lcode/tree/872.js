/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {boolean}
 */
var leafSimilar = function(root1, root2) {
  var left1 = [];
  var left2 = [];

  const dfs = (root, arr) => {
    if(!root) {
      return;
    }

    if(!root.left && !root.right) {
      arr.push(root.val);
    }

    dfs(root.left, arr);
    dfs(root.right, arr);
  }

  dfs(root1, left1);
  dfs(root2, left2);

  if(left1.length !== left2.length) {
    return false;
  }

  for(let i = 0; i < left1.length; i++) {
    if(left1[i] !== left2[i]) {
      return false;
    }
  }
  console.log(left1);
  console.log(left2);
  return true;
};
