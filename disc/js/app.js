let app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        loginVisible:false,
        signUpVisible:true,
        resume :{
            name:'姓名',
            gender:'男',
            birthday:'1986年12月',
            jobTitle:'前端开发工程师',
            email:'taosiliang1127tsl@163.com',
            phone:'132xxxx4080'
        },
        signUp:{
            phone:'',
            vcode:'',
            password:''
        }
    },
    methods:{
        onSendVcode(){
            AV.Cloud.requestSmsCode(this.signUp.phone).then(function (success) {
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




            // // console.log(this.resume)
            //  // 声明类型
            // let User = AV.Object.extend('User')
            // // 新建对象
            // let user = new User()
            // // 设置名称
            // user.set('resume', 'this.resume')
            // // 设置优先级
            // // user.set('priority', 1)
            // user.save().then(function (todo) {
            //     console.log('objectId is ' + todo.id)
            // }, function (error) {
            //     console.error(error)
            // })
        },
        // onCloseLogin(){
        //     this.loginVisible = false
        // },
        saveResume(){

        }
    }
})