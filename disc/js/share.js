Vue.component('share',{
    props:['shareLink'],    //接受别的组件传来的参数
    template:`
    <div  class="share" v-cloak>
        <h2>请将下面链接分享给面试官</h2>
            <div>
                 <textarea readonly>{{shareLink}}</textarea>           
             </div>
    </div>
    `
})

