/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */


var lowestCommonAncestor = function(root, p, q) {
  let val = null;

  const dfs = (root) => {
    if(!root) {
      return null;
    }

    dfs(root.left);
    dfs(root.right);

    const l = root.left;
    const r = root.right;


    if(root) {
      (root.val === p.val) && (root.p = true);
      (root.val === q.val) && (root.q = true);
    }

    if(l) {
      (l.val === p.val || l.p) && (root.p = true);
      (l.val === q.val || l.q) && (root.q = true);
    }

    if(r) {
      (r.val === p.val || r.p) && (root.p = true);
      (r.val === q.val || r.q) && (root.q = true);
    }

    if(root.p && root.q && !val) {
      val = root;
    }

  }

  dfs(root);

  return val;
};
