/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  if(!matrix || !matrix.length) {
    return [];
  }


  let hStart = 0;
  let hEnd = matrix[0].length - 1;
  let sStart = 0;
  let sEnd =  matrix.length - 1;

  const current = [0, 0];

  const result = [];

  function isEnd() {
    return (hStart > hEnd) || (sStart > sEnd);
  }

  function toRight() {
    while(current[1] <= hEnd) {
      result.push(matrix[current[0]][current[1]]);
      if(current[1] < hEnd) {
        current[1]++;
      }else {
        break;
      }
    }

    sStart++;

    if(isEnd()) {
      return;
    }

    current[0]++;
    toBottom();
  }

  function toBottom() {
    while (current[0] <= sEnd) {
      result.push(matrix[current[0]][current[1]]);
      if(current[0] < sEnd) {
        current[0]++;
      }else {
        break;
      }
    }

    hEnd--;

    if(isEnd()) {
      return;
    }

    current[1]--;
    toLeft();
  }

  function toLeft() {
    while (current[1] >= hStart) {
      result.push(matrix[current[0]][current[1]]);
      if(current[1] > hStart) {
        current[1]--;
      }else {
        break;
      }
    }


    sEnd--;

    if(isEnd()) {
      return;
    }

    current[0]--;
    toTop();
  }

  function toTop() {
    while (current[0] >= sStart) {
      result.push(matrix[current[0]][current[1]]);

      if(current[0] > sStart) {
        current[0]--;
      }else {
        break;
      }
    }

    hStart++;

    if(isEnd()) {
      return;
    }

    current[1]++;
    toRight();
  }

  toRight(current);

  return result;
};

const result = spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]);
console.log('result', result);
