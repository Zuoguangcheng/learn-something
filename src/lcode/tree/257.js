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
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    var paths = [];
    var str = '';
    slove(root, str, paths)

    return paths;
};


var slove = function (root, str, paths) {
  if(!root) {
    return;
  }

  if(!root.left && !root.right) {
    str = str + root.val;
    paths.push(str);
  }else {
    str = str + root.val + '->';
  }

  slove(root.left, str, paths);
  slove(root.right, str, paths);
}

