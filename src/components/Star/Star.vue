<template>
  <div class="star" :class="'star-'+size">
    <span class="star-item" v-for="(sc, index) in starClasses" :class="sc" :key="index"></span>
  </div>
</template>

<script>
  export default {
    props: {
      score: Number,
      size: Number
    },
    computed: {
      starClasses(){
        // 3.2 ---> on on on off  off
        // 3.5 ---> on on on half off
        const {score} = this
        const scs = []
        // 得到分数的整数
        const scoreInteger = Math.floor(score)
        for(var i=0; i<scoreInteger; i++){
          scs.push('on')
        }
        // 小数部分大于0.5，就添加一个half
        if(score*10-scoreInteger*10 >= 5){
          scs.push('half')
        }
        while(scs.length < 5){
          scs.push('off')
        }
        return scs
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixins.styl'
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>