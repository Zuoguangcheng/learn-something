
function getInit(target) {
    let Ctor = target.constructor;

    return new Ctor;
}


// 基础版本
function clone(target, map = new WeakMap()) {

  if (typeof target === 'object') {
    // 如果是array
    let cloneTarget = Array.isArray(target) ? [] : {};

    if(map.get(target)) {
      return target;
    }

    map.set(target, cloneTarget)

    for (let key in cloneTarget) {
      cloneTarget[key] = clone(target[key], map);
    }

    return cloneTarget;

  } else {
    return target;
  }

}