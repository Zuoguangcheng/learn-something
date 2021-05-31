/**
 * @param {number[]} numbers
 * @return {number}
 */
/*var minArray = function(numbers) {
  if(!numbers) {
     return 0;
  }

  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    console.log('left', left);
    console.log('right', right);
    if(numbers[mid + 1] < numbers[mid]) {
      return numbers[mid + 1];
    }

    if(numbers[mid - 1] && numbers[mid - 1] > numbers[mid]) {
      return numbers[mid];
    }


    if(numbers[mid - 1] && numbers[mid - 1] <= numbers[mid] && numbers[mid] < numbers[0]) {
      left = mid + 1;
      right = mid - 1;
    }

    if(numbers[mid - 1] && numbers[mid - 1] <= numbers[mid] && numbers[mid] > numbers[0]) {
      left = mid + 1;
    }
  }

  return numbers[0]
};*/



var minArray = function(numbers) {
  let low = 0;
  let high = numbers.length - 1;
  while (low < high) {
    const pivot = low + Math.floor((high - low) / 2);
    if (numbers[pivot] < numbers[high]) {
      high = pivot;
    } else if (numbers[pivot] > numbers[high]) {
      low = pivot + 1;
    } else {
      high -= 1;
    }
  }
  return numbers[low];
};

minArray([1, 1]);
