import React, { useMemo, useEffect } from 'react'

import { ReactReduxContext } from './Context'
import Subscription from '../utils/Subscription'



/**
 * 使用React.Context  将store 和 subscription传递给下面使用，
 * subscription 则是创建的一个监听
 * 
 * @param {*} param0 
 * 
 * @return 
 * 
 */

function Provider({ store, context, children }) {

  /**
   * return store  和   subscription
   * 
   */
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);

    console.log('subscription', subscription);

    subscription.onStateChange = subscription.notifyNestedSubs
    return {
      store,
      subscription,
    }
  }, [store])

  const previousState = useMemo(() => store.getState(), [store])

  useEffect(() => {
    const { subscription } = contextValue

    /**
     *  subscription.trySubscribe()
     * 
     *  相当于  store.subscribe(subscription.notifyNestedSubs)
     *  而 subscription.notifyNestedSubs 则是 调用了subscription中的
     *  this.listeners.notify()
     * 
     * 这里创建了一个监听，当store变化的时候 调用了 subscription.listeners.notify();
     * 
    */
    subscription.trySubscribe()

    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs()
    }
    return () => {
      // 页面写在， 解除绑定
      subscription.tryUnsubscribe()
      subscription.onStateChange = null
    }
  }, [contextValue, previousState])

  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default Provider
