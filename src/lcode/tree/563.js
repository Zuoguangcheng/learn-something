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
var findTilt = function(root) {
    var sum = 0;


    var solve = (root) => {
      if(!root) {
        return 0;
      }

      const left = solve(root.left);
      const right = solve(root.right);
      sum += Math.abs(left - right);

      return root.val + left + right;
    }
  console.log(solve(root));


  return sum;
};




