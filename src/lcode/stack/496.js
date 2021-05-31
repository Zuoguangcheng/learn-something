/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */


var nextGreaterElement = function (nums1, nums2) {
  var stack = [];
  var map = new Map();

  nums2.forEach(item => {
    if (stack.length === 0) {
      stack.push(item);
    } else {
      while (stack[stack.length - 1] < item) {
        map.set(stack[stack.length - 1], item);
        stack.pop();
      }
      stack.push(item);
    }
  });


  while (stack.length > 0) {
    map.set(stack[stack.length - 1], -1);
    stack.pop();
  }

  return nums1.map(item => {
    return map.get(item);
  })

};

console.log(nextGreaterElement([2,4], [1,2,3,4]));