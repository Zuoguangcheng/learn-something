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
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */

var isCousins = function(root, x, y) {
    const queue = [];
    root.deep = 1;
    root.parent = null;
    queue.push(root);

    let nodeX = null;
    let nodeY = null;

    while (queue.length) {
      const item = queue.shift();

      if(item.val === x) {
        nodeX = item;
      }

      if(item.val === y) {
        nodeY = item;
      }

      item.left && (item.left.deep = item.deep + 1) && (item.left.parent = item) && queue.push(item.left);
      item.right && (item.right.deep = item.deep + 1) && ((item.right.parent = item)) && queue.push(item.right);

    }

    return nodeX.deep === nodeY.deep && nodeX.parent.val !== nodeY.parent.val;


  // console.log('nodeX', nodeX);
  // console.log('nodeY', nodeY);
};
