/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let max = nums[0];
    let dp = [];
    dp[0] = nums[0];

    for(let i = 1; i < nums.length; i++) {
      dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);

      max = Math.max(dp[i], max);
    }

    return max;
};

const max = maxSubArray([1, 2, 3, 5, -2, 3]);
console.log('max', max);
