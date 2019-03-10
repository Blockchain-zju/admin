<template>
    <div  class="shouye" >
      
        <div id="content1">
          <div style="display:flex;flex-direction:rol;justify-content: space-around;">
          <div class="zjutokeninfo">
              <md-card class="zjutokeninfo">
                <md-card-header>
                  <md-card-header-text>
                    <div class="md-title" style="text-align:center">Token合约账户</div>
                  </md-card-header-text>

                  <md-menu md-size="big" md-direction="bottom-end">
                    <md-button class="md-icon-button" md-menu-trigger>
                      <md-icon>more_vert</md-icon>
                    </md-button>

                    <md-menu-content>
                      <md-menu-item @click="doACall">
                        <span>Call</span>
                        <md-icon>phone</md-icon>
                      </md-menu-item>

                      <md-menu-item @click="sendMessage">
                        <span>Send a message</span>
                        <md-icon>message</md-icon>
                      </md-menu-item>
                    </md-menu-content>
                  </md-menu>
                </md-card-header>

                <md-card-content style="width:40vw">
                <md-table>

                <md-table-row>
                    <md-table-cell >Token 总量</md-table-cell>
                    <md-table-cell>{{max}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Token 释放总量</md-table-cell>
                    <md-table-cell>{{supply}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Token 锁仓总量</md-table-cell>
                    <md-table-cell>{{frozen_amount}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Issuer</md-table-cell>
                    <md-table-cell>{{issuer}}</md-table-cell>
                </md-table-row>
                </md-table>

                </md-card-content>

              </md-card>
            </div>            
            <div class="zjutokeninfo" >
              <md-card class="zjutokeninfo">
                <md-card-header>
                  <md-card-header-text>
                    <div class="md-title" style="text-align:center">下一次解锁</div>
                  </md-card-header-text>

                  <md-menu md-size="big" md-direction="bottom-end">
                    <md-button class="md-icon-button" md-menu-trigger>
                      <md-icon>more_vert</md-icon>
                    </md-button>

                    <md-menu-content>
                      <md-menu-item @click="doACall">
                        <span>Call</span>
                        <md-icon>phone</md-icon>
                      </md-menu-item>

                      <md-menu-item @click="sendMessage">
                        <span>Send a message</span>
                        <md-icon>message</md-icon>
                      </md-menu-item>
                    </md-menu-content>
                  </md-menu>
                </md-card-header>


                <md-card-content style="width:40vw;">
                <md-table>
                <md-table-row>
                    <md-table-cell >下一次解锁时间</md-table-cell>
                    <md-table-cell>{{next_release_day}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >下一次解锁数量</md-table-cell>
                    <md-table-cell>{{release_amount_pertime}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >释放次数</md-table-cell>
                    <md-table-cell>{{released_times}}</md-table-cell>
                </md-table-row>
                </md-table>
                </md-card-content>
              </md-card>
            </div>
          

          </div>
          <div id="resent-action" style="margin-top:3vw">
          <md-card>
                <md-card-header>
                  <md-card-header-text>
                    <div class="md-title" >最近交易</div>
                  </md-card-header-text>

                  <md-menu md-size="big" md-direction="bottom-end">
                      <md-button @click="toall()">所有交易</md-button>
                  </md-menu>
                </md-card-header>

                <md-card-content >
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
            <!-- <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell v-for="(v,k) in item" :md-label="k" :key="k" >{{v}}</md-table-cell>
            </md-table-row> -->
        </md-table>
                </md-card-content>
          </md-card>
          </div>
          </div>
        </div>
</template>
<style>
  #content1{
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /* margin-top:70px;
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:64px; */
  }
  #recent-action{
      display:flex;
      flex-grow:1;
  }
  /* .scrollaction{
    overflow:auto;
    max-height: 440px;
    overflow-y: auto;
  } */
</style>
<script>
import {eos} from '../main';
//var count=0;
    export default {
        name: 'shouye',
        data(){
          return{
            actions: [],
            actionss:[],
            ok:0,
            max_supply:'',
            supply:'',
            frozen_amount:'',
            issuer:'',
            next_release_day:'',
            release_amount_pertime:'',
            released_times:'',
            transactions:[]
          }
        },
        created:{
        },
        computed:{
           max:function(){this.getTotalNum();return this.max_supply},
        },

        methods: {
         async getTotalNum(){
            eos.getTableRows({code: "zjubcatest11",scope:"AAA",table:"stat",json:"true"}).then(async result=>{
                                  
                                  this.max_supply=result.rows[0].max_supply;
                                  this.supply=result.rows[0].supply;
                                  this.frozen_amount=result.rows[0].frozen_amount;
                                  this.issuer=result.rows[0].issuer;
                                  this.release_amount_pertime=result.rows[0].release_amount_pertime;
                                  this.released_times=result.rows[0].released_times;
                                  this.next_release_day=result.rows[0].next_release_day;
                                  });
                             let n;
              await  eos.getActions({"account_name":"zjubcatest11" , "pos": -1, "offset": -50}).then(async result=>{
                console.log(result)
                n=result.actions.length;
                console.log(n)
                let count=0;
                for(var i=0;i<n;i++){
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
                    if(count==20){
                      break;
                    }       
                    }

                }
                });
                this.ok=!this.ok;
          },
        toall(){
          this.$router.push({name:'pages',
          params: { 
                account: 'zjubcatest11', 
                            }});
        },
      //   onSelect (item) {
      //   this.$router.push({name:'transactioninfo',
      //                      params: { 
      //                           transactionId: item.transactionId, 
      //                           blockId:item.blockId,
      //                       }});
      // }
        }
    }
</script>

