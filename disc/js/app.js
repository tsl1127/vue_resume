let app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        loginVisible:false,
        signUpVisible:false,
        currentUser:{
            objectId:'',
            email:'',
        },
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
        onLogin(){   //登录
            // console.log(this.login)           
            AV.User.logIn(this.login.email, this.login.password).then( (user)=> {
                // console.log(user);
                user = user.toJSON()
                this.currentUser = {     //登录进来之后，对currentUser赋值
                    objectId:user.objectId,
                    email:user.email,
                }
                this.loginVisible =false
            },  (error)=> {
                if(error.code===211){
                    alert('邮箱不存在')
                }else if(error.code===210){
                    alert('邮箱和密码不匹配')
                }
                // console.log(error)
                // console.log(error.code)
            });
        },
        hasLogin(){
            return !!this.currentUser.objectId
        },
        onLogout(){
            AV.User.logOut();
            alert('登出成功')
            // 现在的 currentUser 是 null 了
            // var currentUser = AV.User.current();
            window.location.reload()  //登出之后刷新页面
        },
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
                this.currentUser.objectId=user.objectId
                this.currentUser.email=user.email
                this.signUpVisible =false
            }, (error)=> {
                alert(error.rawMessage)
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
            let {objectId} = AV.User.current().toJSON()
            let user = AV.Object.createWithoutData('User', objectId)
            // 修改属性
            user.set('resume', this.resume)
            // 保存到云端
            user.save().then(()=>{
                alert('保存成功')
            },()=>{
                alert('保存失败')
            })
        },
        getResume(){   //获取对象
            let query = new AV.Query('User')
            query.get(this.currentUser.objectId).then((user)=>{
                // console.log(user)
                let resume = user.toJSON().resume
                // console.log(resume)
                this.resume = resume
            },(error)=>{
                
            })
        }
    }
})



let currentUser = AV.User.current()
    // console.log(currentUser)
if(currentUser){
    app.currentUser = currentUser.toJSON()
    app.getResume()
}

