/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
 var backspaceCompare = function(s, t) {
    let stackS = [];
    let stackT = [];

    for(let i = 0; i < s.length; i++) {
      if(s[i] !== '#') {
        stackS.push(s[i]);
      }else {
        stackS.pop();
      }
    }

  for(let i = 0; i < t.length; i++) {
    if(t[i] !== '#') {
      stackT.push(t[i]);
    }else {
      stackT.pop();
    }
  }

  return stackS.toString() === stackT.toString();

};

backspaceCompare(1, 2);
