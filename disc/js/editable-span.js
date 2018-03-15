Vue.component('editable-span',{
    props:['value'],
    template:`
    <span class="editableSpan">
    <span v-show="!editing">{{value}}</span>
    <input type="text" v-show="editing" v-bind:value="value" @input = "triggerEdit">
    <button v-on:click="editing=!editing">edit</button>
    </span>
    `,
    data(){
        return {
            editing:false
        }
    },
    methods:{
        triggerEdit(e){
            // console.log(e.target.value)
            this.$emit('edit',e.target.value)
        }
    }

    
})
