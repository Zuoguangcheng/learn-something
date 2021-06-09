/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
    let l = 0;
    let r = nums.length - 1;
    while (l <= r) {
        let m = l + Math.floor((r - l) / 2);

        if(nums[m] > m) {
          if(m === 0) {
            return 0;
          }
          if(nums[m - 1] === m - 1) {
            return (nums[m] - 1);
          }else {
            r = m - 1;
          }
        }

        if(nums[m] === m) {
          if(nums[m + 1] > m + 1) {
            return (nums[m] + 1);
          }else {
            l = m + 1;
          }
        }


    }

    return nums.length;
};

const result = missingNumber([0,2,3]);
console.log('result', result);
