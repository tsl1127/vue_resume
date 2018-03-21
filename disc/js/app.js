let app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        loginVisible:false,
        signUpVisible:false,
        shareVisible:false,
        skinPickerVisible:false,
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

       
        shareLink:'',
        mode:'edit' ,//编辑模式（当前用户模式）或预览模式 preview
        // mainClass:'default'
    },
    computed:{   
        displayResume(){
        //    return  this.mode==='preview' ? this.previewResume : this.resume
       let a= this.mode==='preview' ? this.previewResume : this.resume
    //    console.log(a)
       return a
        }
    },
    watch:{     //监听变化
        'currentUser.objectId':function(newValue,oldValue){
            // console.log(newValue)
            if(newValue){
                this.getResume(this.currentUser).then((resume)=>{this.resume=resume})
            }
        }
    },
    methods:{
        onShare(){
            if(this.hasLogin()){
                this.shareVisible=true;
            }else{
                alert('请先登录')
            }
        },
        fonLogin(user){
            this.currentUser.objectId=user.objectId
            this.currentUser.email =user.email
            // this.getResume(this.currentUser)
            this.loginVisible=false
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

        print(){
            window.print()
        },

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







