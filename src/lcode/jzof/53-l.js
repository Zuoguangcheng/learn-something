/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {

  if(!nums) {
    return 0;
  }

  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    let m = l + Math.ceil((r - l) / 2);
    if(nums[m] < target) {
      l = m + 1;
    }

    if(nums[m] > target) {
      r = m - 1;
    }

    if(nums[m] === target) {
      let sum = 1;
      let i = m - 1;
      let j = m + 1;

      while (nums[i] === target) {
        sum++;
        i--;
      }

      while (nums[j] === target) {
        sum++;
        j++;
      }

      return sum;
    }
  }

  return 0;
};


const m = search([5,7,7,8,8,10], 10);
console.log('m', m);

