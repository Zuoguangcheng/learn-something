/**
 * @fileoverview fiber
 * @author liuduan
 * @Date 2020-06-20 21:22:07
 * @LastEditTime 2020-06-20 22:27:22
 */
/**
 * 2个阶段：reconciliation-调度阶段（可被打断），commit-DOM渲染阶段（不可被打断）
 * 数组结构 转变成 链表结构
 * 任务+过期时间/优先级
 * 把side-effect 放到queue队列等待commit阶段再处理
 * commit阶段处理所有side-effect
 * 
 * 
 * 
 * 
 * ReactDom.render 从这开始看：react-dom/src/client
 * 
 * 1. 创建 FiberRoot 对象
 * 2. 调用 updateContainer 
 * FiberRoot === dom._reactRootContainer
 *      current --> FiberNode
 * 
 * 3. 创建current得到第一个fiberNode，内容是 <App/>
 * FiberNode 
 *      child
 *      sibling
 *      return 
 *      updateQueue 状态更新队列
 *      effectTag   更新类型 replace delete update
 *      firstEffect 副作用链表head
 *      lastEffect  副作用链表tail
 *      expirationTime 过期时间 时间戳 与优先级有关
 *      alternate   上一次更新时的旧fiber
 * 
 * 4. 设置fiberNode节点优先级，不同的优先级返回不同的 expirationTime
 *      Immediate 最高 100
 *      UserBlocking
 *      Normal 
 *      Low  250
 *      Idle
 *    TODO:mode & ConcurrentMode === noMode 位运算 & 出来 不是1就变0
 * 
 *      计算逻辑：
 *      ceiling 函数
 * 
 * 
 * 
 * 5. ReactDom 3种启动方式(考点)
 *      render 稳定版本，legacy模式
 *      createBlockingRoot 中间稳定模式，blocking模式
 *      createRoot 不稳定模式，concrrent模式
 * 
 * 
 * 6. 封装callback
 * 7. 新建一个update，添加到fiber的updaateQueue
 * 8. scheduleWork 调度流程，需要记住的
 *      
 * 
 * 
 * 
 * unatchedUpdates 同步更新，不走批处理
 * batchedUpdates  批处理
 * isBatchingUpdates
 * 
 * 
 * 
 */