/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
  if(!root) {
    return [];
  }

    const queue = [];
    root.level = 0;
    queue.push(root);

    const list = [];

    while (queue.length) {
      let cur = queue.shift();

      if(!list[cur.level]) {
        list[cur.level] = [cur.val];
      }else {
        list[cur.level].push(cur.val);
      }

      cur.left && (cur.left.level = cur.level + 1) && queue.push(cur.left);
      cur.right && (cur.right.level = cur.level + 1) && queue.push(cur.right);
    }

    return list;
};
