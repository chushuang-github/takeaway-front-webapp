<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
      <router-link to="/search" slot="left" class="header_search">
        <i class="iconfont icon-icon_search" style="color:white; fontSize:25px"></i>
      </router-link>
      <router-link :to="userInfo._id ? '/userinfo' : '/login'" slot="right" class="header_login">
        <span class="header_login_text" v-if="!userInfo._id">
          登录|注册
        </span>
        <span class="header_login_text" v-else>
          <i class="iconfont icon-icon-person"></i>
        </span>
      </router-link>
    </HeaderTop> 
 
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category, index) in categorys" :key="index">
              <div class="food_container">
                <img :src="baseImageUrl+category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination --> 
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="">
    </nav>

    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList />
    </div>
  </section>
</template>
  
<script>
  import {mapState} from 'vuex'
  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import ShopList from '../../components/ShopList/ShopList'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  export default {
    components: {
      HeaderTop,
      ShopList
    },
    data(){
      return {
        baseImageUrl: 'https://fuss10.elemecdn.com'
      }
    },
    mounted(){
      this.$store.dispatch('getCategorys')
      this.$store.dispatch('getShops')
    },
    watch: {
      // 监听categos，当这个数据变化时，表示已经请求回数据了
      // 数据发生变化，是异步更新界面，只有界面更新之后才可以new Swiper()
      categorys(){
        // 有数据之后，等dom元素更新之后，就可以new Swiper()
        // this.$nextTick就是在下次dom元素更新之后，执行里面的回调函数
        this.$nextTick(() => {
          // 创建一个swiper实例对象，来实现轮播
          // new Swiper的时间必须是列表加载完成之后才可以
          new Swiper('.swiper-container', {
            loop: true,
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            }
          })
        })
      }
    },
    computed: {
      ...mapState(['address', 'categorys', 'userInfo']),
      // 根据categorys一维数组生成二维数组
      categorysArr(){
        const {categorys} = this
        // 准备一个空的二维数组
        const arr = []
        let minArr = []
        categorys.forEach(item => {
          if(minArr.length === 8){
            minArr = []
          }
          if(minArr.length === 0){
            arr.push(minArr)
          }
          minArr.push(item)
        })
        return arr
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixins.styl'
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>