function trapD(height) {
  // 初始化变量
  var len = height.length;
  let leftMax = new Array(len);
  let rightMax = new Array(len);
  let res = 0;
  
  // 初始化赋值
  leftMax[0] = height[0]
  rightMax[len - 1] = height[len - 1]
  // 获取完整的leftMax
  for (let i = 1; i < len; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i])
  }
  // 获取完整的rightMax
  for (let i = len - 2; i > -1; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i])
  }
  // 开始进行计数操作
  for (let i = 0; i < len; i++) {
    res += Math.min(leftMax[i], rightMax[i]) - height[i]
  }
  return res
}

const res = trapD([0,1,0,2,1,0,1,3,2,1,2,1]);

console.log('res', res);


