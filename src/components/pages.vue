<template>
<div>
    
    <md-card md-with-hover style="height:40vw">
      <md-ripple>
        <md-card-header>
          <div class="md-title">{{message}}</div>
        </md-card-header>

        <md-card-content>
        <md-progress-spinner v-if="ok" md-mode="indeterminate" style="margin-left:35vw"></md-progress-spinner>
        <md-table v-else v-model="actions" md-fixed-header md-card @md-selected="onSelect">
        <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
            <md-table-cell md-label="time" md-sort-by="id">{{ item.time}}</md-table-cell>
            <md-table-cell md-label="from" md-sort-by="id">{{ item.from }}</md-table-cell>
            <md-table-cell md-label="to"  md-sort-by="id">{{ item.to }}</md-table-cell>
            <md-table-cell md-label="quantity" md-sort-by="id">{{ item.quantity }}</md-table-cell>
            <md-table-cell md-label="memo" md-sort-by="id">{{ item.memo }}</md-table-cell>
            <md-table-cell md-label="区块高度" md-sort-by="id">{{ item.height }}</md-table-cell>
        </md-table-row>
        </md-table>
        </md-card-content>

        <md-card-actions>
            <span>{{this.message}}</span><span>第{{this.currentpage}} 页</span>
          <md-button @click="prepage()"><span class="glyphicon glyphicon-minus"></span></md-button>
          <md-button @click="nextpage()"><span class="glyphicon glyphicon-plus"></span></md-button>
        </md-card-actions>
      </md-ripple>
    </md-card>
</div>
</template>
<script>
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs'
import {eos} from '../main'
export default {
    data(){
        return{
            currentpage:1,
            actions:[],
            actionss:[],
            transactions:[],
            loadpertime:10,
            ok:1,
            total:0,
            pagenum:0,
            allpage:0,
            account:'',
            actionindex:[],
        }
    },
    computed:{
        message:function(){this.actionindex[0]=-1;this.account=this.$route.params.account;this.getPage();return "Actions";},
    },
    methods:{
        async getPage(){
            let n;
            if(this.currentpage!=1&&this.actionindex[this.currentpage-1]<0){
                    alert("这是最后一页了！");
                    this.currentpage=this.currentpage-1;
                    this.getPage();
                    return;
                }
          await  eos.getActions({"account_name":this.account,pos:this.actionindex[this.currentpage-1],offset:-60}).then(async result=>{
                n=result.actions.length;
                if(this.currentpage===1){
                    this.actionindex[0]=result.actions[n-1].account_action_seq;
                }
                if(n==0){
                    alert("这是最后一页了！");
                    this.currentpage=this.currentpage-1;
                    this.getPage();
                    return;
                }
                let count=0;
                let i=0;
                for(var j;j<10;j++){
                    actions[j]={};
                }
                for(i=0;i<n;i++){
                    if(result.actions[n-i-1].action_trace.act.name==="transfer"&&
                            result.actions[n-i-1].action_trace.receipt.receiver==="zjubcatest11"){
                    //console.log(i)
                    this.actions[count]={
                                    "time":result.actions[n-i-1].block_time,
                                    "from":result.actions[n-i-1].action_trace.act.data.from,
                                     "to":result.actions[n-i-1].action_trace.act.data.to,
                                     "quantity":result.actions[n-i-1].action_trace.act.data.quantity,
                                     "memo":result.actions[n-i-1].action_trace.act.data.memo,
                                     "height":result.actions[n-i-1].block_num,
                                     };   
                    count=count+1;            
                    if(count==10){
                      break;
                    }       
                    }

                }
                this.actionindex[this.currentpage]=this.actionindex[this.currentpage-1]-i;
                });
                this.ok=!this.ok;
        },
        nextpage(){
                this.currentpage=this.currentpage+1;
                this.ok=0;
                this.getPage();
        },
        prepage(){
            if(this.currentpage-1>=1){
                this.currentpage=this.currentpage-1;
                this.ok=0;
                this.getPage();
            }
        },
    //   onSelect (item) {
    //     this.$router.push({name:'transactioninfo',
    //                        params: { 
    //                             transactionId: item.transactionId, 
    //                             blockId:item.blockId,
    //                         }});
    //   }
    }
}
</script>
