<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="iconfont icon-jian" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-if="food.count">{{food.count}}</div>
    <div class="iconfont icon-jia" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  export default {
    props: {
      // 父组件将食品传过来
      food: Object
    },
    methods: {
      updateFoodCount(isAdd){
        // isAdd为true时，增加；isAdd为false时。减少
        this.$store.dispatch('updateFoodCount', {isAdd, food:this.food})
        // 下面的方法直接修改也会使页面更新，但是不要这样写
        // 因为food是vuex的state里面的goods对象中的数据，修改vuex的state要在mutations中
        // 在mutations中修改数据，才会被vue-tools工具监听到每一次操作的变化
        // if(!this.food.count){
        //   Vue.set(this.food, 'count', 1)
        // }else{
        //   if(isAdd){
        //     this.food.count++
        //   }else{
        //     this.food.count--
        //   }
        // }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl" 
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

    .icon-jian
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
      &.move-enter.to, &.move-leave
        opacity 0
        transform translateX(0px) rotate(0deg)
      &.move-enter-active, &.move-leave-active
        transition all .3s
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(15px) rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-jia
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 22px
      color $green
</style>