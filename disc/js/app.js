let app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        loginVisible:false,
        signUpVisible:false,
        resume :{
            name:'姓名',
            gender:'男',
            birthday:'1986年12月',
            jobTitle:'前端开发工程师',
            email:'taosiliang1127tsl@163.com',
            phone:'132xxxx4080'
        },
        signUp:{
            email:'',
            password:''
        },
        login:{
            email:'',
            password:''
        }
    },
    methods:{
        onLogin(){
            // console.log(this.login)           
            AV.User.logIn(this.login.email, this.login.password).then(function (user) {
                console.log(user);
            }, function (error) {
                if(error.code===211){
                    alert('邮箱不存在')
                }else if(error.code===210){
                    alert('邮箱和密码不匹配')
                }
                // console.log(error)
                // console.log(error.code)
            });
        },
        onSignUp(){
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
            user.signUp().then(function (user) {
                // console.log(user);
            }, function (error) {
            });
        },
        onEdit(key,value){
            // this.resume.name = e.target.innerText
            // console.log(value)
            // console.log(this)
            // this.resume.name=value
            // console.log(key,value)
            this.resume[key]=value
        },
        onClickSave(){
            let currentUser = AV.User.current()
            // console.log(currentUser)
            if(!currentUser){
                this.loginVisible=true            
            }else{
                this.saveResume()
            }
        },
        saveResume(){
            // 第一个参数是 className，第二个参数是 objectId
            // console.log(AV.User.current())
            let {id} = AV.User.current()
            let user = AV.Object.createWithoutData('User', id)
            // 修改属性
            user.set('resume', this.resume)
            // 保存到云端
            user.save();
        }
    }
})