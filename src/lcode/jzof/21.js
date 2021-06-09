/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function(nums) {
  let i = 0;
  let j = nums.length - 1;


  while (j > i) {

    if(nums[j] % 2) {
      if(!(nums[i] % 2)) {
        let temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        i++;
        j--;
      }else {
        i++;
      }
    }else {
      j--;
    }
  }

  return nums;
};
