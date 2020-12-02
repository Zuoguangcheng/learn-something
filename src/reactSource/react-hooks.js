/**
 * @fileoverview
 * @author liuduan
 * @Date 2020-06-21 21:23:56
 * @LastEditTime 2020-06-21 21:33:12
 */


/**
 * @description useState
 * 
 * 1. 执行mountState
 *      1. hook.memoizedState
 *      2. 创建queue，包含dispatch
 *      3. 返回初始值，dispatch
 * 
 * 
 * 2. 执行dispatch（dispatchAction）
 *      1. 创建update对象
 *      2. 把 update 添加到queue里
 *      3. 提前计算出最新的state
 *      4. 调用了一次 scheduleWork，进入调度
 * 
 * 
 * 3. 执行updateState
 *      1. 在这里更改state
 */
