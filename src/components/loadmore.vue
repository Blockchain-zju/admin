<template>
<div>
    
    <md-card md-with-hover>
      <md-ripple>
        <md-card-header>
          <div class="md-title">Actions</div>
        </md-card-header>

        <md-card-content>
        <md-progress-spinner v-if="ok" md-mode="indeterminate" style="margin-left:35vw"></md-progress-spinner>
        <md-table v-else v-model="actionss" md-fixed-header ref="cardTable">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell v-for="(v,k) in item" :md-label="k" :key="k" >{{v}}</md-table-cell>
            </md-table-row>
        </md-table>
        </md-card-content>

        <md-card-actions>
          <md-button @click="loadmoreactions()">{{load}}</md-button>
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
            actions:[],
            actionss:[],
            transactions:[],
            loadtime:1,
            loadpertime:10,
            ok:1,
        }
    },
    computed:{
        load:function(){this.getAllActions();return "LOADMORE"},
    },
    methods:{
      async  getAllActions() {
            let n;
            let num;
          await  eos.getActions({"account_name":"zjubcatest11" , "pos": -1, "offset": -(this.loadtime*this.loadpertime)}).then(async result=>{
                console.log(result);
                n=result.actions.length;
                console.log(n);
                if(n%this.loadpertime===0){
                    num=10;
                }
                else{
                    num=n%this.loadpertime;
                }
                for(var i=0;i<num;i++){
                    this.actions[i]={"actionId":result.actions[num-i-1].account_action_seq,
                                     "blockId":result.actions[num-i-1].block_num,
                                     "block_time":result.actions[num-i-1].block_time,
                                     "name":this.name};
                }
                });
                for(var i=0;i<num;i++){
                    await eos.getBlock(this.actions[i].blockId).then(async res=>{
                      //console.log(res.transaction_mroot);
                    this.transactions[i]=res.transaction_mroot});
                }
                for(var i=n-num;i<n;i++){
                    console.log(this.transactions[i+num-n]);
                    this.actionss.push({"actionId":this.actions[i+num-n].actionId,
                                     "blockId":this.actions[i+num-n].blockId,
                                     //"transactionId":"{{<a @click='routerto' v-html>{{this.transactions[i]}}</a>}}",
                                     "transactionId":this.transactions[i+num-n],
                                     "block_time":this.actions[i+num-n].block_time,
                                    });
                }
                this.ok=!this.ok;
        },
        loadmoreactions(){
            this.loadtime=this.loadtime+1;
            this.getAllActions();
        }
    }
}
</script>
