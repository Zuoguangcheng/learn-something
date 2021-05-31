/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node} root
 * @return {number}
 */
var maxDepth = function(root) {
  let sum = 0;

  const dfs = (root, cur) => {
      if(!root) {
        return null;
      }

      const p = cur + 1;
      sum = Math.max(sum, p);
      Array.isArray(root.children) && root.children.forEach(item => {
          dfs(item, p);
      });
  }

  dfs(root, 0);

  return sum;
};
