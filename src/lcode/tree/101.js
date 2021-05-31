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
let isSymmetric = function(root) {
  let p = root;
  let q = root;


  let isSymmetric = true;

  let e = function (pNode, qNode) {
    if(!pNode && !qNode) {
      return true;
    }else if(!pNode || !qNode) {
      return false;
    }

    return pNode.val === qNode.val && e(pNode.left, qNode.right) && e(pNode.right, qNode.left);
  }


  return e(p, q);
  // q = q.right;

};
