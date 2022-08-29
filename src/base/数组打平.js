//https://zhuanlan.zhihu.com/p/416707105


const myFlat = (arr) => {
    return arr.reduce((pre, cur) => {
      return pre.concat(Array.isArray(cur) ? myFlat(cur) : cur)
    }, [])
}


const myFlatFn = (arr) => {
  const flatArr = [];


  const loop = (arr) => {
    for(let i = 0; i < arr.length; i++) {
      if(Array.isArray(arr[i])) {
        loop(arr[i]);
      } else {
        flatArr.push(arr[i]);
      }
    }
  }

  loop(arr);

  return flatArr;
}


const myFlatFnLoop = (arr) => {
  let flatArr = [];

  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
     flatArr = flatArr.concat(myFlatFnLoop(arr[i]));
    }else {
      flatArr.push(arr[i]);
    }
  }

  return flatArr;
}

const arr = [1, 2, [[3, 4], 5, [6, 7, 8], 9], 10, [11, 12]];

const result = myFlatFnLoop(arr);
console.log('result', result);
