<template>
<div>
    <div  >
    </div>
    <div >
    <md-card md-with-hover>
      <md-ripple>
        <md-card-header>
                  <md-card-header-text>
                    <div class="md-title" >我的账户</div>
                  </md-card-header-text>
                  <md-menu md-size="big" md-direction="bottom-end">
                      <md-button @click="renew">renew</md-button>
                  </md-menu>
        </md-card-header>

        <md-card-content>
                <md-table>
                <!-- <md-table-row>
                    <md-table-head md-numeric>ID</md-table-head>
                    <md-table-head>Name</md-table-head>
                    <md-table-head>Email</md-table-head>
                    <md-table-head>Gender</md-table-head>
                    <md-table-head>Job Title</md-table-head>
                </md-table-row> -->

                <md-table-row>
                    <md-table-cell >Account Name</md-table-cell>
                    <md-table-cell>{{name}}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell>StudentId</md-table-cell>
                    <md-table-cell>{{StudentId}}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell>studentname</md-table-cell>
                    <md-table-cell>{{studentname}}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell>注册时间</md-table-cell>
                    <md-table-cell>{{registration_date}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>注册到期时间</md-table-cell>
                    <md-table-cell>{{expiration_date}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>余额</md-table-cell>
                    <md-table-cell>{{left}}</md-table-cell>
                </md-table-row>


                </md-table>

        </md-card-content>

      </md-ripple>
    </md-card>
        <md-card md-with-hover>
      <md-ripple>
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
        </md-table>
        </md-card-content>

      </md-ripple>
    </md-card>
    </div>
</div>
</template>
<style lang="scss" scoped>
  .md-card {
    width:80vw ;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
<script>
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs'
import {eos} from '../main'
  const getLocalTime=(nS) =>{     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}
export default {
    data(){
        return{
            ok:0,
            name:'',
            StudentId:'',
            pk:'',
            leftnum:'',
            actions:[],
            actionss:[],
            transactions:[],
            studentname:"",
            registration_date:"",
            expiration_date:"",
            // actionId:'',
            // blockId:'',
            // block_time:'',
        }
    },
    computed:{
        left:function(){this.mess();return this.leftnum},


    },
    methods:{
          mess(){
            ScatterJS.plugins(new ScatterEOS());

            ScatterJS.scatter.connect('ZJUBCA.VOTE', {
              initTimeout: 10000,
            }).then(async connected => {
              if (!connected) {
                alert('please unlock your scatter');
                return false
              }
              const network = {
                blockchain: 'eos',
                protocol: 'https',
                host: 'api-kylin.eoslaomao.com',
                port: 443,
                chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
              };

              let scatter = ScatterJS.scatter;
              await scatter.getIdentity({accounts: [network]}).then(identity=>{console.log(identity)});
              const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
              this.name=account.name;

              this.getAccountInfo();
            })
          },
      async  getAccountInfo() {
            //studentid
            await eos.getTableRows({code: "zjubcatest12",scope:"zjubcatest12",table:"members",json:"true"}).then(res=>{
            console.log(res)
            let nn=res.rows.length;
            console.log(res.rows[1].eosaccount===this.name);
            let ii;
            for(ii=0;ii<nn;ii++){
                if(res.rows[ii].eosaccount===this.name){
                  console.log("ok");
                    this.StudentId=res.rows[ii].studentid;
                    this.studentname=res.rows[ii].studentname;
                    this.registration_date=getLocalTime(res.rows[ii].registration_date);
                    this.expiration_date=getLocalTime(res.rows[ii].expiration_date);
                    if(res.rows[ii].expiration_date<Date.parse(new Date())/1000){
                        this.expiration_date=this.expiration_date+"(注册已过期，请renew！）"
                    }    
                    break;
                }
            }
            if(ii===nn){
              alert("请先注册！")
            }
            })
            //student currency balance
            eos.getCurrencyBalance({code:'zjubcatest11',account:this.name,symbol:'AAA'}).then(result=>{this.leftnum=result[0]});
            //get actions
            let n;
            await  eos.getActions({"account_name":this.name , "pos": -1, "offset": -50}).then(async result=>{
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
                // for(var i=0;i<n;i++){
                //     await eos.getTransaction(this.actions[i].trx_id).then(async res=>{
                //     this.transactions[i]=this.actions[i].trx_id});
                // }
                // for(var i=0;i<n;i++){
                //     this.actionss[i]={"actionId":this.actions[i].actionId,
                //                      "blockId":this.actions[i].blockId,
                //                      //"transactionId":"{{<a @click='routerto' v-html>{{this.transactions[i]}}</a>}}",
                //                      "transactionId":this.transactions[i],
                //                      "block_time":this.actions[i].block_time,
                //                     };
                // }
                this.ok=!this.ok;
        },
      // onSelect (item) {
      //   this.$router.push({name:'shouye',
      //                      });
      // },
        toall(){
          this.$router.push({name:'pages',
          params: { 
                account: this.name, 
                            }});
        },
        renew(){
          ScatterJS.plugins(new ScatterEOS());

          ScatterJS.scatter.connect('ZJUBCA.TOKEN', {
            initTimeout: 10000,
          }).then(async connected => {
            if (!connected) {
              console.log('please unlock your scatter');
              return false
            }
            const network = {
              blockchain: 'eos',
              protocol: 'https',
              host: 'api-kylin.eoslaomao.com',
              port: 443,
              chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
            };

            let scatter = ScatterJS.scatter;
            await scatter.getIdentity({accounts: [network]});
            const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
            const eos = scatter.eos(network, Eos, {expireInSeconds: 20});

            console.log(account.authority)
            console.log(eos)
            var res = await eos.transaction({
                              actions: [
                              {
                                  account: "zjubcatest11", //has to be the smart contract name of the token you want to transfer - eosio for EOS or eosjackscoin for JKR for example
                                  name: "transfer",
                                  authorization: [{
                                      actor: account.name,
                                      permission: account.authority
                                  }
                                  ],
                                  data: {
                                      from: account.name,
                                      to: 'zjubcatest12',
                                      quantity: "10000.0000 AAA",
                                      memo: "renew$"+"my"+"$"+"account",
                                  }
                              }]
                          }).catch(error => {
                              console.error(error);
                              alert("更新失败")
                          });
        });

    }
    }
}
</script>

