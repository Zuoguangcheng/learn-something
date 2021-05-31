/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
    if(!matrix || !matrix.length) {
      return false;
    }

    const row = matrix.length;
    const column = matrix[0].length;

    let i = 0;
    let j = column - 1;

    while (i < row && j >= 0) {
      if (matrix[i][j] === target) {
        return true;
      }

      if (matrix[i][j] < target) {
        i++;
      } else {
        j--;
      }
    }

    return false;
};
