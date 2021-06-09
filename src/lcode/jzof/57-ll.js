/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
  let l = 1;
  let r = 2;

  const sums = [];

  while (r <= ((target + 1) / 2) ) {

    let sum = (l + r) * (r - l + 1) / 2;
    if(sum < target) {
      r++;
    }

    if(sum > target) {
      l++;
    }

    if(sum === target) {
      let temp = [];
      for(let i = l; i <= r; i++) {
        temp.push(i);
      }
      sums.push(temp);
      l++;
    }
  }
  return sums;
};

const sums = findContinuousSequence(9);
console.log('sums', sums);
