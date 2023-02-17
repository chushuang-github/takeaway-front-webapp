<template>
  <div>
    <div class="goods">

      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--current-->
          <li class="menu-item" v-for="(good,index) in goods" 
            :key="index" :class="{current: index===currentIndex}" @click="chickMenuItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>

      <div class="foods-wrapper" ref="foodsWrapper">
        <ul ref="foodUI">
          <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food,index) in good.foods" :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.image">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart />
    </div>
    <Food :food="food" ref="food"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import CartControl from '../../../components/CartControl/CartControl'
  import Food from '../../../components/Food/Food'
  import ShopCart from '../../../components/ShopCart/ShopCart'
  import BScroll from 'better-scroll'
  export default {
    data(){
      // 在滑动的过程中，实时手机scrollY；列表第一次显示后，手收集tops
      return {
        scrollY: 0,         //右侧滑动的Y轴坐标(滑动过程中实时变化)
        tops:[],            //所有右侧li的top组成的数组(列表显示过于，就不再变化)
        food: {},           //点击的food
      }
    },
    components: {
      CartControl,
      Food,
      ShopCart
    },
    mounted(){
      // diapatch的时候，传一个回调函数，当数据请求成功的时候，调用这个函数
      this.$store.dispatch('getShopGoods', () => {
        // 数据更新，在界面更新之后进行new BScroll()操作
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      })
    },
    methods: {
      // 初始化滚动条
      _initScroll(){
        new BScroll(this.$refs.menuWrapper,{
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 2,
          click: true
        })
        // 根右侧的滚动绑定一个监听
        this.foodsScroll.on('scroll', position => {
          // Math.abs是计算一个数的绝对值
          this.scrollY = Math.abs(position.y)
        })
        // 滚动结束的时候，计算一下scrollY的值
        this.foodsScroll.on('scrollEnd', position => {
          this.scrollY = Math.abs(position.y)
        }) 
      },
      // 收集tops数组 
      _initTops(){
        // 1、初始化tops
        const tops = []
        let top = 0
        tops.push(top)
        // 找到所有的分类的li，下面的方法收集的是伪数组
        // const lis = this.$refs.foodUI.children 也可以
        const lis = this.$refs.foodUI.getElementsByClassName('food-list-hook')
        // 2、收集tops，Array.from是将伪数组变成真数组
        Array.from(lis).forEach(li => {
          top += li.clientHeight
          tops.push(top)
        })
        // 下面方法也可以
        // Array.from(lis).forEach(li => {
        //   tops.push(li.offsetTop)
        // })
        // 3、更新状态
        this.tops = tops
      },
      // 点击左侧菜单，右侧滚动到相应的位置
      chickMenuItem(index){
        // 得到目标位置的scrollY
        const y = this.tops[index]
        // 立即更新scrollY的值
        this.scrollY = y
        // 调用scrollTo方法让右侧的列表滚动
        this.foodsScroll.scrollTo(0, -y, 500)
      },
      // 显示点击的food
      showFood(food){
        // 更新food
        this.food = food
        // 显示food组件
        this.$refs.food.toggleShow()
      }
    },
    computed:{
      ...mapState(['goods']),
      // 计算得到当前分类的坐标，根据scrollY和tops两个值计算得出
      currentIndex(){
        // 得到条件数据
        const {scrollY, tops} = this
        // 根据条件计算产生一个结果
        const index = tops.findIndex((top,index) => {
          // return top >= scrollY
          return scrollY >= top && scrollY < tops[index+1]
        })
        // 返回结果
        return index
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 5px
</style>