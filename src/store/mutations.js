// 直接更新state的多个方法的对象
// 更改state里面的数据，必须要使用mutation里面的方法
import Vue from 'vue'
import {
  RECEIVE_ADDRESS, 
  RECEIVE_CATEGORYS, 
  RECEIVE_SHOPS,
  RECEIVE_USERINFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  INCREASE_FOOD_COUNT,
  DECREASE_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation_types'
export default {
  [RECEIVE_ADDRESS] (state, {address}){
    state.address = address
  },
  [RECEIVE_CATEGORYS] (state, {categorys}){
    state.categorys = categorys
  },
  [RECEIVE_SHOPS] (state, {shops}){
    state.shops = shops
  },
  [RECEIVE_USERINFO](state, {userInfo}){
    state.userInfo = userInfo
  },
  [RESET_USER_INFO](state){
    state.userInfo = {}
  },
  [RECEIVE_GOODS](state, {goods}){
    state.goods = goods
  },
  [RECEIVE_RATINGS](state, {ratings}){
    state.ratings = ratings
  },
  [RECEIVE_INFO](state, {info}){
    state.info = info
  },
  // 增加food中的count
  [INCREASE_FOOD_COUNT](state, {food}){
    if(!food.count){      //第一次增加
      // count在food对象中原本是没有的属性，是新增的属性
      // 直接在food里面增加一个属性，这个属性是没有数据绑定的效果的
      // 直接添加的属性发生变化时，页面中如果使用了这个属性，页面时不会发生变化的
      // food.count = 1         //不可以直接添加  
      // 添加新的属性，我们使用Vue.set()这个方法添加，这种方式会让新增的属性是响应式的
      // 第一个参数是目标对象；第二个参数是属性名(字符串)；第三参数是属性值
      Vue.set(food, "count", 1)
      // 第一次的时候，将food添加到cartFoods里面去
      state.cartFoods.push(food)
    }else{
      food.count++
    }
  },
  // 减少food中的count
  [DECREASE_FOOD_COUNT](state, {food}){
    if(food.count){
      food.count--
      if(food.count === 0){
        // 将food从cartFoods中移除
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }
  },
  // 清空购物车
  [CLEAR_CART](state){
    // 清除cartFoods数组中每一个对象中的count属性
    state.cartFoods.forEach(food => {
      food.count = 0
    })
    // 移除购物车中所有的对象
    state.cartFoods = []
  },
  // 搜索商品
  [RECEIVE_SEARCH_SHOPS](state, {searchShops}){
    state.searchShops = searchShops
  }
}