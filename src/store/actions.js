// 异步更新state的多个方法的对象
import {
  RECEIVE_ADDRESS, 
  RECEIVE_CATEGORYS, 
  RECEIVE_SHOPS,
  RECEIVE_USERINFO,
  RESET_USER_INFO,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  RECEIVE_GOODS,
  INCREASE_FOOD_COUNT,
  DECREASE_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation_types'
// 引入发送请求的函数
import {
  reqAddress,
  reqFoodCategorys,
  reqShopList,
  reqUserInfo,
  reqLogout,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings,
  reqSearchShops
} from '../api/index'

export default {
  // 异步获取地址的action
  async getAddress({state,commit}){
    // 发送异步ajax请求
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqAddress(geohash)
    // 根据结果commit一个mutation
    if(result.code === 0){
      const address = result.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },
  // 异步获取食品分类数组
  async getCategorys({commit}){
    // 发送异步ajax请求
    const result = await reqFoodCategorys()
    // 根据结果commit一个mutation
    if(result.code === 0){
      const categorys = result.data
      commit(RECEIVE_CATEGORYS, {categorys})
    }
  },
  // 异步获取商家列表
  async getShops({state,commit}){
    // 发送异步ajax请求
    const {latitude, longitude} = state
    const result = await reqShopList({latitude, longitude})
    // 根据结果commit一个mutation
    if(result.code === 0){
      const shops = result.data
      commit(RECEIVE_SHOPS, {shops})
    }
  },
  // 同步记录用户信息
  recordUser({commit}, userInfo){
    commit(RECEIVE_USERINFO, {userInfo})
  },
  // 异步获取用户的信息
  async getUserInfo({commit}){
    const result = await reqUserInfo()
    if(result.code === 0){
      const userInfo = result.data
      commit(RECEIVE_USERINFO, {userInfo})
    }
  },
  // 异步请求，退出登录
  async logout({commit}){
    const result = await reqLogout()
    if(result.code === 0){
      commit(RESET_USER_INFO)
    }
  },
  // 请求mockjs数据
  async getShopInfo({commit}){
    const result = await reqShopInfo()
    if(result.code === 0){
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  },
  async getShopRatings({commit}, callback){
    const result = await reqShopRatings()
    if(result.code === 0){
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
      callback && callback()
    }
  },
  // Vuex的store的action里面真正发送请求
  async getShopGoods({commit}, callback){
    const result = await reqShopGoods()
    if(result.code === 0){
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      // 数据更新了，通知一下组件 (执行回调函数，就可以通知组件)
      callback && callback()
    }
  },
  // 同步更新food中的count数量
  updateFoodCount({commit}, {isAdd, food}){
    if(isAdd){
      commit(INCREASE_FOOD_COUNT, {food})
    }else{
      commit(DECREASE_FOOD_COUNT, {food})
    }
  },
  // 情况购物车
  clearCart({commit}){
    commit(CLEAR_CART)
  },
  // 异步搜索店铺
  async searchShops({commit, state}, keyword){ 
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShops({geohash,keyword})
    if(result.code === 0){
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS, {searchShops})
    }
  }
}