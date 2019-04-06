<template>
    <div class="table-responsive" style="margin-top:1vw">
            <md-progress-spinner v-if="ok" md-mode="indeterminate" style="margin-left:35vw"></md-progress-spinner>
  <table v-else class="table">
    <caption><span>&nbsp</span><button class="btn btn-default"  style="margin-right:2vw" @click="toall()">所有交易</button></caption>
    <thead>
      <tr>
        <th>proposer</th>
        <th>proposal_name</th>
        <th>packed_transaction</th>
        <th>approve</th>
        <th>unapprove</th>
        </tr>
    </thead>
    <tbody>
      <tr @click="onSelect(item)" v-for="item in transactions" v-bind:key="item.height">
        <td>{{item.proposer}}</td>
        <td>{{item.proposa_name}}</td>
        <td>{{item.packed_transaction}</td>
        <!-- <td><md-button @click="approve(item)" >approve</md-button></td>
        <td><md-button @click="unapprove(item)" >unapprove</md-button></td> -->
        </tr>
    </tbody>
  </table>
</div>
</template>

<script>
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextEncoder, TextDecoder } = require('text-encoding');      // React Native, IE11, and Edge Browsers only

//const privateKeys = [privateKey1];

//const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('https://api-kylin.eoslaomao.com', { fetch });
const api = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  export default {
    name: 'TableMultiple',
    data: () => ({
        ok:1,
        transactions:[],
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
      },
    created(){
      this.getTransaction();
    }
  }
</script>