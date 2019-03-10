<template>
  <div>
    <md-table v-model="searched" md-card @md-selected="onSelect">
      <md-table-toolbar>
        <h1 class="md-title">{{message}}</h1>
      </md-table-toolbar>

      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }" :md-disabled="item.name.includes('Stave')" md-selectable="multiple" md-auto-select>
            <md-table-cell md-label="姓名" md-sort-by="name" >{{ item.name }}</md-table-cell>
            <md-table-cell md-label="学号" md-sort-by="studentid">{{ item.studentid }}</md-table-cell>
            <md-table-cell md-label="EOS账号" md-sort-by="eosid" >{{ item.eosid }}</md-table-cell>
            <md-table-cell md-label="注册时间" md-sort-by="registime" >{{ item.registime }}</md-table-cell>
            <md-table-cell md-label="到期时间" md-sort-by="endtime" >{{ item.endtime }}</md-table-cell>
      </md-table-row>
    </md-table>
<br/>
    <p>Selected:</p>
    {{ selected }}
        <md-field>
          <label>空投数量（每人）</label>
          <md-input v-model="money" autofocus></md-input>
        </md-field>
    <md-button @click="kongtou">空投</md-button>
  </div>
</template>

<script>
import {eos} from '../main'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs'
// const AbiCache = require('abi-cache')
  const getLocalTime=(nS) =>{     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}
  export default {
    name: 'TableMultiple',
    data: () => ({
      selected: [],
        users:[],
        searched:[],
        ok:1,
        money:"",
        actionss:[],
    }),
    methods: {
      onSelect (items) {
        this.selected = items
      },
      getAlternateLabel (count) {
        let plural = ''

        if (count > 1) {
          plural = 's'
        }

        return `${count} user${plural} selected`
      },
      async getMembers(){
        
        console.log(this.selected)
          await eos.getTableRows({code: "zjubcatest12",scope:"zjubcatest12",table:"members",json:"true"}).then(res=>{
              console.log(res)
            let nn=res.rows.length;
            let ii;
            for(ii=0;ii<nn;ii++){
                this.users[ii]={
                  "name":res.rows[nn-ii-1].studentname,
                  "studentid":res.rows[nn-ii-1].studentid,
                  "eosid":res.rows[nn-ii-1].eosaccount,
                  "registime":getLocalTime(res.rows[nn-ii-1].registration_date),
                  "endtime":getLocalTime(res.rows[nn-ii-1].expiration_date),
                }    
                if(res.rows[nn-ii-1].expiration_date<Date.parse(new Date())/1000){
                    this.users[ii].name=this.users[ii].name+"(已过期）"
                }    
            }
            this.searched=this.users;
          
          });
          this.ok=!this.ok;
      },
        async kongtou(){
          let accountPermission=[];
         await eos.getAccount("zjubcatest11").then(res=>{console.log(res.permissions);
                        for(var i=0;i<res.permissions[0].required_auth.accounts.length;i++){
                          accountPermission[i]=res.permissions[0].required_auth.accounts[i].permission
                        }
         })
         let abi;
        // await eos.getAbi({ account_name: "zjubcatest11"}).then(ress=>{abi});
        //eos.fc.abiCache.abi("zjubcatest11",abi)
         console.log("ok")
            for(var i=0;i<this.selected.length;i++){
                this.actionss[i]={
                  account: "zjubcatest11", //has to be the smart contract name of the token you want to transfer - eosio for EOS or eosjackscoin for JKR for example
                                  name: "transfer",
                                  authorization: accountPermission,
                                  data: {
                                      from: "zjubcatest11",
                                      to: this.selected[i].eosid,
                                      quantity: this.money,
                                      memo: "kongtou"
                  }
                }
            }          
            let proposeTransaction={actions:this.actionss};

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
            const Scattereos = scatter.eos(network, Eos, {expireInSeconds: 20});
            // await eos.getAbi({ account_name: "zjubcatest11"});
            console.log(Scattereos.contract("eosio.msig"))
            // eos.contract("zjubcatest11")
            //         .then(rs => {console.log(rs.fc.abi)})
            // console.log(eos.fc.abiCache)
            //eos.fc.toBuffer("",abi);});
            console.log(Scattereos);
            console.log(Scattereos.fc.abiCache);
                            var res = Scattereos.contract('eosio.msig').then(contract=>{
                              contract.propose({
                                    proposer:account.name,
                                    proposal_name:"kongtou",
                                    requested:accountPermission,
                                    trx:{
                                      "expiration": "2018-08-11T15:28:57",
                                      "ref_block_num": 0,
                                      "ref_block_prefix": 0,
                                      "max_net_usage_words": 0,
                                      "max_cpu_usage_ms": 0,
                                      "delay_sec": 0,
                                      "context_free_actions": [],
                                      "actions":this.actionss,
                                    }                      
                          },{broadcast: false, sign: false})}).catch(error => {
                              console.error(error);
                          });
                          // var res = await eos.transaction({
                          //   actions:[{
                          //           account:"eosio.msig",
                          //           name:"propose",
                          //           authorization:[{
                          //             actor:account.name,
                          //             permission:account.authority
                          //           }],
                          //           data:{
                          //           proposer:account.name,
                          //           proposal_name:"kongtou",
                          //           requested:accountPermission,
                          //           trx:{
                          //             "expiration": "2018-08-11T15:28:57",
                          //             "ref_block_num": 0,
                          //             "ref_block_prefix": 0,
                          //             "max_net_usage_words": 0,
                          //             "max_cpu_usage_ms": 0,
                          //             "delay_sec": 0,
                          //             "context_free_actions": [],
                          //             "actions":this.actionss,
                          //           }                                           
                          //           }

                          //   }]
                 
                          // }).catch(error => {
                          //     console.error(error);
                          // });

          // })
         
        })
        }
    },
    computed:{
        message:function(){
            this.getMembers();
            return "请选择"
        }
    }
  }
</script>

<style lang="scss" scoped>
  .md-table + .md-table {
    margin-top: 16px
  }
</style>