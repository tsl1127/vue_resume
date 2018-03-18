let app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        loginVisible:false,
        signUpVisible:false,
        shareVisible:false,
        previewUser:{
            objectId:undefined,
        },
        previewResume:{

        },
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
            phone:'132xxxx4080',
            skills:[
            {
                name:'请填写技能名称',
                description:'请填写技能描述'
            },
            {
                name:'请填写技能名称',
                description:'请填写技能描述'
            },
            {
                name:'请填写技能名称',
                description:'请填写技能描述'
            },
            {
                name:'请填写技能名称',
                description:'请填写技能描述'
            }
            ],
            projects:[
                {name:'请填写项目名称',link:'请填写项目链接',keywords:'请填写关键词',description:'请填写项目描述'},
                {name:'请填写项目名称',link:'请填写项目链接',keywords:'请填写关键词',description:'请填写项目描述'},
                {name:'请填写项目名称',link:'请填写项目链接',keywords:'请填写关键词',description:'请填写项目描述'},
                {name:'请填写项目名称',link:'请填写项目链接',keywords:'请填写关键词',description:'请填写项目描述'}
            ]
        },
        signUp:{
            email:'',
            password:''
        },
        login:{
            email:'',
            password:''
        },
        shareLink:'',
        mode:'edit' //编辑模式（当前用户模式）或预览模式 preview
    },
    computed:{   
        displayResume(){
           return  this.mode==='preview' ? this.previewResume : this.resume
        }
    },
    watch:{     //监听变化
        'currentUser.objectId':function(newValue,oldValue){
            // console.log(newValue)
            if(newValue){
                this.getResume(this.currentUser)
            }
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
            // console.log(key)
            let regex= /\[(\d+)\]/g
            key=key.replace(regex,(match,number)=>`.${number}`)  //让key变成只有.分割的东西
            keys=key.split('.')  //用.分割
            // console.log(keys)
            let result =this.resume
            for(let i=0;i<keys.length;i++){
                if(i===keys.length-1){
                    result[keys[i]]=value
                }else{
                    result = result[keys[i]]
                }               
                //result === this.resume
                //keys===['skills','0','name']
                //i=0  result === result['skills] ===this.resume.skills
                //i=1 result === result['0'] === this.resume.skills.0
                //i-2 result === result['name']===this.resume.skills.0.name
                //resume === this.resume['skills']['0']['name']

            }
            // result=value
            //this.resume['skills']['0']['name']=value
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
        getResume(user){   //获取对象
            let query = new AV.Query('User')
            return query.get(user.objectId).then((user)=>{
                // console.log(user)
                let resume = user.toJSON().resume
                return resume
                // console.log(resume)
                // console.log(this.resume)
                // this.resume = resume    //没有skills，最好用下面的
                // Object.assign(this.resume,resume)  //右边有什么属性，就搬移过来，如果没有，就保留左边的
                // console.log(this.resume)
            },(error)=>{

            })
        },
        addSkill(){
            this.resume.skills.push({name:'请填写技能名称',description:'请填写技能描述'})
        },
        removeSkill(index){
            this.resume.skills.splice(index,1)  //从数组的第index个开始删除，只删除一个
        },
        addProject(){
            this.resume.projects.push({name:'请填写项目名称',link:'请填写项目链接',keywords:'请填写关键词',description:'请填写项目描述'})
        },
        removeProject(index){
            this.resume.projects.splice(index,1)
        },
        print(){
            window.print()
        }
    },   
})


//获取当前用户
let currentUser = AV.User.current()
// console.log(currentUser)
if (currentUser) {
    app.currentUser = currentUser.toJSON()
    app.shareLink = location.origin + location.pathname + '?user_id=' + app.currentUser.objectId
    // console.log('current id:'+app.currentUser.objectId)
    app.getResume(app.currentUser).then(resume=>{
        // console.log(this)
        app.resume=resume
    })            
}

//获取预览用户的Id
let search = location.search
// console.log(search)
let regex =/user_id=([^&]+)/
let matchs=search.match(regex)
let userId
if(matchs){
    userId=matchs[1]
    app.mode='preview'
    // console.log('preview id:'+userId)
    app.getResume({objectId:userId}).then(resume=>{
        app.previewResume=resume
    })  
}







