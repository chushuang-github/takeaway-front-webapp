// 基于state的getter计算属性
export default { 
  totalCount(state){
    return state.cartFoods.reduce((preTotal, food) => {
      return preTotal + food.count
    }, 0)
  },
  totalPrice(state){
    return state.cartFoods.reduce((prePrice, food) => {
      return prePrice + food.count * food.price
    }, 0)
  },
  positiveSize(state){
    return state.ratings.reduce((pre, rating) => {
      return pre + (rating.rateType===0 ? 1:0)
    }, 0)
  }
}