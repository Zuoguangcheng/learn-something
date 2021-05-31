/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
  if(nums.length === 0 || !nums) {
    return null;
  }

  var head = new TreeNode();


  var buildTree = function (root, l, r) {
      if(l > r) {
        return null;
      }

      let m = Math.floor(l + (r - l) / 2);
      root.val = nums[m];
      if(l <= m - 1) {
        root.left = new TreeNode();
        buildTree(root.left, l, m - 1);
      }

      if(m + 1 <= r ) {
        root.right = new TreeNode();
        buildTree(root.right, m + 1, r);
      }
  }

  buildTree(head, 0, nums.length - 1);

  return head;
};


var sortedArrayToBST = function(nums){
  if (nums.length === 0 || !nums) {
    return null;
  }


  var buildTree = function (l, r) {
    if(l > r) {
      return null;
    }

    var root = new TreeNode();

    let m = Math.floor(l + (r - l) / 2);
    root.val = nums[m];
    root.left = buildTree(l, m - 1);
    root.right = buildTree(m + 1, r);

    return root;
  }

  return buildTree(0, nums.length - 1);
}
