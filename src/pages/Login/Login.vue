<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button 
                :disabled="!rightPhone"
                class="get_verification" 
                :class="{right_phone: rightPhone}"
                @click.prevent="getCode"
              >
                {{computeTime ? `已发送(${computeTime})s` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>

          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class="{right:showPwd}"></div>
                  <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img 
                  class="get_verification" 
                  ref="captcha"
                  src="http://localhost:4000/captcha" 
                  alt="captcha" 
                  @click="getCaptcha"
                >
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip v-show="showAlert" @closeTip="hiddenAlert" :alertText="alertText"></AlertTip>
  </section>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip'
  import {reqPwdLogin, reqSendCode, reqSmsLogin} from '../../api/index.js'
  export default {
    data(){
      return {
        loginWay: true,       //true表示短信登录，false表示密码登录
        phone: '',            //手机号
        code: '',             //验证码  
        name: '',             //用户名   
        pwd: '',              //密码
        captcha: '',          //svg图形验证码
        computeTime: 0,       //计时的时间
        showPwd: false,       //是否显示密码
        alertText: '',        //提示文本
        showAlert: false,     //是否显示AlertTip组件
        intervalId: '',       //循环定时器id
      }
    },
    components: {
      AlertTip
    },
    computed: {
      rightPhone(){
        return /^1\d{10}$/.test(this.phone)
      }
    },
    methods: {
      // 发送请求，获取短信验证码
      async getCode(){
        // 启动倒计时(当前没有计时的时候才可以启动定时器)
        if(this.computeTime === 0){
          this.computeTime = 30
          this.intervalId = setInterval(() => {
            this.computeTime--
            if(this.computeTime <= 0){
              // 停止计时
              clearInterval(this.intervalId)
            }
          }, 1000)
          // 发送ajax请求(向指定手机号发送验证码短信)
          const result = await reqSendCode(this.phone)
          console.log(result)
          if(result.code === 1){
            // 短信失败，显示提示，停止倒计时
            this.showAlertTip(result.msg)
            if(this.computeTime){
              this.computeTime = 0
              clearInterval(this.intervalId)
            }
          }
        }
      },
      // 登录
      async login(){
        // 前台表单验证
        let result
        if(this.loginWay){    // 短信登录
          const {phone, code, rightPhone} = this
          if(!rightPhone){
            // 手机号不正确
            this.showAlertTip('手机号不正确')
          }else if(!/^\d{6}$/.test(code)){
            // 验证码必须是6位数字
            this.showAlertTip('验证码必须是6位数字')
          }else{
            result = await reqSmsLogin({phone, code})
          }
        }else{                //密码登录
          const {name, pwd, captcha} = this
          if(!name){
            // 用户名必须指定
            this.showAlertTip('用户名必须指定')
          }else if(!pwd){
            // 密码必须指定
            this.showAlertTip('密码必须指定')
          }else if(!captcha){
            // 验证码必须指定
            this.showAlertTip('验证码必须指定')
          }else{
            result = await reqPwdLogin({name, pwd, captcha})
          }
        }
        // 不论成功还是失败，都要停止定时器
        if(this.computeTime){
          this.computeTime = 0
          clearInterval(this.intervalId)
        }
        // 根据请求结果，进行判断
        if(result.code === 0){
          // 使用密码登录成功
          const user = result.data
          // 将user保存到vuex 的state中，跳转路由(去个人中心页面)
          this.$store.dispatch('recordUser', user)
          this.$router.replace('/profile')
        }else{
          // 登录失败，显示新的svg验证码，显示弹窗告诉用户登录失败
          const msg = result.msg
          this.getCaptcha()
          this.showAlertTip(msg)
        }
      },
      // 开启警告框
      showAlertTip(alertText){
        this.alertText = alertText
        this.showAlert = true
      },
      // 关闭警告框
      hiddenAlert(){
        this.showAlert = false
      },
      // 获取一个新的图片验证码
      getCaptcha(event){
        // 服务器是打开的，http://localhost;4000/captcha就是图片路径
        // 使用event.target.src更改路径，为了是路径每次不一样，在后面加了time=Date.now()
        // event.target.src = 'http://localhost:4000/captcha?time='+Date.now()
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixins.styl'
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>