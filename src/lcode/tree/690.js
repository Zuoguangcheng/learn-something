/**
 * Definition for Employee.
 * function Employee(id, importance, subordinates) {
 *     this.id = id;
 *     this.importance = importance;
 *     this.subordinates = subordinates;
 * }
 */

/**
 * @param {Employee[]} employees
 * @param {number} id
 * @return {number}
 */
var GetImportance = function(employees, id) {
  if(!employees.length) {
    return 0;
  }

  const map = new Map();

  employees.forEach(item => {
    map.set(item.id, item);
  });

  let sum = 0;

  var dfs = (empoyee) => {
    if(!empoyee) {
      return;
    }

    sum = empoyee.importance + sum;

    empoyee.subordinates && empoyee.subordinates.forEach(item => {
      dfs(map.get(item));
    })
  }

  dfs(map.get(id));

  return sum;
};
