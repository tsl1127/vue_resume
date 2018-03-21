window.SignUp={
    data(){
        return {
            signUp:{
                email:'',
                password:''
            }, 
        }   
    },
    methods:{
        onSignUp(){     //注册
            // e.preventDefault()  //阻止表单自动跳转  或者直接在vue里写
            // console.log(this.signUp)
              // 新建 AVUser 对象实例
            const user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUp.email)
            // 设置密码
            user.setPassword(this.signUp.password)
            // 设置邮箱
            user.setEmail(this.signUp.email)
            user.signUp().then( (user)=>{
                // console.log(user);
                alert('注册成功')
                user = user.toJSON()
                // this.currentUser.objectId=user.objectId
                // this.currentUser.email=user.email
                // this.signUpVisible =false
                this.$emit('signUp',user)
            }, (error)=> {
                alert(error.rawMessage)
            });
        },
        onClickLogin(){
            this.$emit('goToLogin')
        }
    },
    template:`
    <div  class="signUp" v-cloak>
    <form class="form" @submit.prevent="onSignUp">  <!-- 阻止默认跳转  文档里叫做事件修饰符-->
        <h2>注册</h2>
        <!--<button type="button" @click="signUpVisible = false">关闭</button>-->
        <router-link to="/">关闭</router-link>
        <div class="row">
            <label>邮箱</label>
            <input type="text" v-model="signUp.email">    
        </div>
        <div class="row">
                <label>密码</label>
                <input type="password" v-model="signUp.password">
            </div>
        <div class="actions">
            <button type="submit">提交</button>
            <!--<a href="#" @click="onClickLogin" >登录</a>-->
            <router-link to="/login">登录</router-link>
        </div>

    </form>
</div>
    `
}

Vue.component('signUp',SignUp)  //注册组件

