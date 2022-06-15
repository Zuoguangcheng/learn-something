const arr = [
  1,
  [1],
  [1,[1]],
  [1,[1,[1]], [1,[3]]],
  [1,[1,[1,[1]]], [1]]
]

function getDep(item) {
  let maxDeep = 0;

  function loop(item, deep) {
    if(!Array.isArray(item)) {
      maxDeep = Math.max(maxDeep, deep);
    }else {
      item.forEach(j => {
        loop(j, deep + 1);
      })
    }
  }

  loop(item, 1)

  return maxDeep;
}


arr.forEach(item => {
  console.log('item', getDep(item, 1));
})

