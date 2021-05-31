/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function(nums) {
  if(!nums || !nums.length) {
    return null;
  }

  var object = {}

  for(let i = 0; i < nums.length; i++) {
    if(object[nums[i]]) {
      return nums[i];
    }

    object[nums[i]] = true;
  }

  return null;
};
