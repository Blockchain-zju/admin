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
// import {eos} from '../main'
// import ScatterJS from 'scatterjs-core'
// import ScatterEOS from 'scatterjs-plugin-eosjs'
// import Eos from 'eosjs'
//import { EosApi, JsonRpc, RpcError } from 'eosjs';
// const { JsonRpc } = require('eosjs');
// const fetch = require('node-fetch');           // node only; not needed in browsers
// const rpc = new JsonRpc('https://api-kylin.eoslaomao.com', { fetch });

// rpc.get_table_rows({code: "eosio.msig",scope:"yangjiani233",table:"proposal",json:"true"}).then(ress=>{
//               console.log(ress);
//               rpc.deserializeTransaction({transaction:ress.rows[0].packed_transaction}).then(re=>{
//                 console.log(re);
//               })
//             });


// const Fcbuffer = require('fcbuffer')
// const assert = require('assert')
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextEncoder, TextDecoder } = require('text-encoding');      // React Native, IE11, and Edge Browsers only

//const privateKeys = [privateKey1];

//const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('https://api-kylin.eoslaomao.com', { fetch });
const api = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
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
      async getTransaction(){
          const resp = await rpc.get_table_rows({
          json: true,              // Get the response as json
          code: 'eosio.msig',     // Contract that we target
          scope: 'yangjiani233',         // Account that owns the data
          table: 'proposal',      // Table name
          limit: 10,               // Maximum number of rows that we want to get
          // reverse = false,         // Optional: Get reversed data
          // show_payer = false,      // Optional: Show ram payer
        });
        console.log(resp.rows)
        var p=resp.rows[0].packed_transaction;
        var pp=[];
        for(let i=0;i<p.length;i++){
            pp[i]=p[i];
        }
        var t=new Uint8Array(pp);
        console.log(t);
        const res=await api.deserializeTransactionWithActions({
          transaction:resp.rows[0].packed_transaction
        });
        console.log(res);
        },
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
      /*
        async kongtou(){
          let accountPermission=[];
          //get permission
         await eos.getAccount("zjubcatest11").then(res=>{console.log(res.permissions);
                        for(var i=0;i<res.permissions[0].required_auth.accounts.length;i++){
                          accountPermission[i]=res.permissions[0].required_auth.accounts[i].permission
                        }
         })
         console.log("ok")
         //set kongtou actions;
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
            console.log(Scattereos);
            Scattereos.fc.abiCache.abiAsync("zjubcatest11");

                          let definitions = {
                              message_type: 'fixed_string16', // CustomType: built-in type
                              account_name: 'fixed_string16', // CustomType: built-in type
                              message: { // struct
                                  fields: {
                                    proposer: 'account_name',
                                    proposal_name: 'account_name',
                                    requested: 'permission_level[]',
                                    trx: 'trx'
                                  }
                              }
                          }
                          //sucess sign signiture
                          // await Scattereos.transaction({
                          //   actions:[{
                          //           account:"eosio.msig",
                          //           name:"approve",
                          //           authorization:[{
                          //             actor:account.name,
                          //             permission:account.authority
                          //           }],
                          //           data:{
                          //           proposer:"yangjiani233",
                          //           proposal_name:"kongtou",
                          //           level:{
                          //               actor:account.name,
                          //               permission:account.authority,
                          //           },                                   
                          //           }

                          //   }]
                 
                          // }).catch(error => {
                          //     console.error(error);
                          // });   
                          // Warning: Do not use {defaults: true} in production
                          let fcbuffer = Fcbuffer(definitions, {defaults: true})
                          let fcbuffer2 = fcbuffer.extend({
                                permission_name: 'fixed_string16',
                                permission_level: {
                                    fields: {
                                      actor: 'account_name',
                                      permission: 'permission_name'
                                    }
                                },
                                action_name: 'fixed_string16',
                                action: {
                                    fields: {
                                      account: 'account_name',
                                      name: 'action_name',
                                      authorization:'permission_level[]',
                                      data:'bytes'
                                    }
                                },
                                trx:{
                                  fields:{
                                      expiration: 'time',
                                      ref_block_num: "uint16",
                                      ref_block_prefix: "uint32",
                                      max_net_usage_words: "varuint32",
                                      max_cpu_usage_ms: "uint8",
                                      delay_sec: "varuint32",
                                      actions:"action[]",   
                                  }
                                                                         
                                    },
                            })
                            assert(fcbuffer2.errors.length === 0, fcbuffer2.errors)

                          // If there are no errors, you'll get your structs
                          var {message} = fcbuffer2.structs
                          console.log(message.toObject());
            Scattereos.getTableRows({code: "eosio.msig",scope:"yangjiani233",table:"proposal",json:"true"}).then(ress=>{
              console.log(ress);
              console.log(eos);
              eos.deserializeTransaction({transaction:ress.rows[0].packed_transaction}).then(re=>{
                console.log(re);
              })
                          console.log(Fcbuffer.fromBuffer(message,ress.rows[0].packed_transaction))});
                          //propose
                          // var res = await Scattereos.transaction({
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
                          //             "expiration": new Date(Date.parse(new Date()) + 1000 * 60 * 10),
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
        },
        */

    },
    computed:{
        message:function(){
            //this.getMembers();
            this.getTransaction();
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