/**
 * 最小堆
 *
 * 这里比较大小是按照数字的来， 如果有自定义比较，将比较大小逻辑替换即可
 *
 * */

/**
 *
 * 堆排序， 就是每次找到最大或者最小的值， 和堆尾最后一个未排序的值进行交换，再重新调整堆。这样，当所有的堆顶都交换一遍后，整个堆就是一个有序的
 * 最大堆是顺序
 * 最小堆是倒序
 *
 * */


class MinHeap {
  constructor(){
    this.heap = [];
  }

  getHeap() {
    return this.heap;
  }

  // 获取左子节点下标
  getLeftIndex(index) {
    return index * 2 + 1;
  }

  // 获取右子节点下标
  getRightIndex(index) {
    return index * 2 + 2;
  }

  // 获取父节点下标
  getParentIndex(index) {
    if(index === 0) {
      return undefined
    }

    return Math.floor((index - 1) / 2);
  }

  // 插入节点
  insert(value) {
    if(value) {
      this.heap.push(value); // 添加到数组末尾
      this.siftUp(this.heap.length - 1); // 调整堆的顺序
      return true;
    }

    return false;
  }

  // 元素上移
  siftUp(index) {
    let parent = this.getParentIndex(index); // 获取父节点index值
    while (index > 0 && (this.heap[parent] > this.heap[index])) {
      // 如果不是根节点，并且父节点比子节点的值大， 则交换。
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];  // 交换父子节点

      // 交换结束后 继续向上比较
      index = parent;
      parent = this.getParentIndex(index);
    }
  }

  findMin() {
    return this.heap.length === 0 ? undefined : this.heap[0];
  }

  // 删除最小的值，也就是堆顶
  extract() {
    if(this.heap.length === 0) {
      return undefined;
    }

    if(this.heap.length === 1) {
      return this.heap.shift(); // 删除原数组中的第一个元素，并且返回
    }

    const removeValue = this.heap[0];

    this.heap[0] = this.heap[this.heap.length - 1] // 将堆尾复制给堆顶
    this.heap.pop(); // 将堆尾删除
    this.siftDown(0); // 将对顶向下移动， 调整堆的顺序
    return removeValue;
  }


  siftDown(index) {
    //index 需要向下移动调整的下标
    const left = this.getLeftIndex(index);
    const right = this.getRightIndex(index);


    // minChild 找到子节点最小的值
    let minChild = left;

    if(right <= this.heap.length) {
        minChild = this.heap[left] < this.heap[right] ? left : right;
    }

    if(left > this.heap.length) {
      return;
    }

    // 比较当前值和子节点最小的值， 如果当前值大于子节点最小的值， 则交换，再继续比较
    if(this.heap[index] > this.heap[minChild]) {
      [this.heap[index], this.heap[minChild]] = [this.heap[minChild], this.heap[index]];
      this.siftDown(minChild);
    }
  }
}

const heap = new MinHeap();

heap.insert(5);
heap.insert(2);
heap.insert(4);
heap.insert(3);
heap.insert(1);
heap.extract();
heap.extract();

const myHeap = heap.getHeap();
console.log('myHeap',myHeap);
