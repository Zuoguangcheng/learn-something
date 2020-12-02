/**
 * @fileoverview ReactDOM源码
 * @author liuduan
 * @Date 2020-06-21 10:40:34
 * @LastEditTime 2020-06-21 15:46:07
 */
/*
提供api
interface ReactDOM {
    createPortal,
    findDOMNode,
    hydrate,
    render,
    unstable_batchedUpdates,  // 批处理
}
*/

/**
 * @description ReactDOM.render
 *
 * legacyRenderSubtreeIntoContainer
 *      1. 在dom-root上构建_reactRootContainer RootFiber by legacyCreateRootFromDOMContainer
 *      2. shouldHydrate=false 清空dom内容，hydrate时shouldHydrate=true，不清空dom内容 while ((rootSibling = container.lastChild)) { container.removeChild(rootSibling);}
 *      3. dom-root._reactRootContainer = new ReactRoot(dom-root)
 *      4. 创建ReactRoot实例过程：dom-root._reactRootContainer._internalRoot = createFiberRoot(dom-root) // _internalRoot就是ReactRoot
 *      5. 调用ReactRoot实例的render方法同步渲染子节点，dom-root._reactRootContainer.render(children, callback);
 * 
 * 
 * ReactRoot.render
 *      1. work = new ReactWork TODO:
 *      2. updateContainer(children, _internalRoot, null, work._onCommit);
 *      3. 设置优先级 expirationTime TODO:
 *              render  最高优先级99
 *              用户输入  次级98
 *              normal   97
 *              low      96 
 *              Idle     95
 *      4. 新建一个update，添加到FiberNode的updateQueue里面，
 *              const update = createUpdate(expirationTime); 
 *              update.payload = {element};
 *              enqueueUpdate(current, update);
 *      5. scheduleWork (调度流程) 内部调用requestWork，updateContainer | setState 都会以scheduleWork为入口执行调度任务，非常重要
 *      6. requestWork ：批处理拦截方法 & 4个判断条件
 *                  isRendering 拦截，是否在commitRoot渲染dom中
 *                  isBatchingUpdates 拦截 是否开启批处理
 *                  isUnbatchingUpdates 不拦截
 *                  expirationTime === Sync 不拦截 是否是同步任务
 *      7. performSyncWork ：开始执行同步构建fiber，diff，updateState，将isWorking、isRendering设置为true，结束后将isWorking设置为false
 *        
 * 
 *      
 * 
 * 
 * 
 * 
 * 
 *      scheduleWork = scheduleUpdateOnFiber
 *      8. enque...args
 *      9. flushWork 
 *      performWorkUnitlDeadline
 *      requestHostCallback
 *      10. new MessageChannel 宏任务执行 flushWork，postMessage(flushWork) 异步的递归。这里没有使用requestAinimationFrame
 *  
 * 
 *      performSyncWorkOnRoot
 *          workLoopSync
 *              performUnitOfWork
 *                  beginWork - 递归创建 FiberNode
 *                      updateHostRoot
 *                          reconcileChildren
 *                               mountChildFibers 得到fiber节点，打上effectTag标记：更新删除创建，在这里diff
 *                      completeWork
 *                  completeUnitOfWork (next==null标识)
 *                      createInstance创建dom对象，但是还没有挂载，dom对象存在fiberNode.stateNode上
 *                      构建副作用链表
 * 
 *
 */

export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;

/**
 * @description ReactRoot
 *      current: FiberNode
 *      containerInfo: dom-root
 *      finishedWork: TODO:
 *      expirationTime
 *      firstBatch
 *      
 * 
 *      ReactRoot原型方法：
 *          render
 *          unmount
 *          legacy_renderSubtreeIntoContainer
 *          createBatch
 */


/**
 * @description FiberNode
 *      child
 *      sibling
 *      return
 *      updateQueue 状态更新队列
 *      effectTag   更新类型 replace delete update
 *      firstEffect 副作用链表head
 *      lastEffect  副作用链表tail
 *      expirationTime 过期时间 时间戳 与优先级有关
 *      childExpirationTime
 *      alternate   fiber更新中对象
 */
