/**
 * @param {number[]} nums
 * @return {number}
 *
 * 摩尔投票法
 */
var majorityElement = function(nums) {

    let count = 1;
    let num = nums[0];
    for(let i = 1; i < nums.length; i++) {
        if(nums[i] === num) {
          count++;
        }else {
          count--;
        }

        if(count === 0) {
          num = nums[i + 1];
          ++i;
          count = 1;
        }
    }

    return num;
};

majorityElement([1,2,3,2,2,2,5,4,2]);
