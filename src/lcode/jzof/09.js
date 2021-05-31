var CQueue = function() {
  this.stack = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
  this.stack.push(value);
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
  if(!this.stack.length) {
    return -1;
  }

  const head = this.stack.shift();

  return head;
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
