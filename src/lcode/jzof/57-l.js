/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    if(!nums) {
      return []
    }
    let i = 0;
    let j = nums.length - 1;

    while (true) {
      if(i >= j) {
        return [];
      }

      const sum = nums[i] + nums[j];

      if(sum > target) {
        j--;
      }

      if(sum < target) {
        i++;
      }

      if(sum === target) {
        return [nums[i], nums[j]];
      }
    }
};
