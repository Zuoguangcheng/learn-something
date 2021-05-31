/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param { TreeNode } root
 * @return { TreeNode }
 */
var increasingBST = function(root) {
  const res = [];



  const inorder = (root) => {
    if(!root) {
      return;
    }

    inorder(root.left);
    res.push(root.val);
    inorder(root.right);
  }
  inorder(root);


  console.log('res', res);

  const head = new TreeNode(-1);
  let cur = head;

  res.forEach(item => {
    curNode = new TreeNode(item);
    cur.right = curNode;
    cur = curNode;
  });

  return head.right;
};
