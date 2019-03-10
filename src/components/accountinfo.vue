<template>
    <md-card>
      <md-card-header>
        <div class="md-title">Transaction Infomation</div>
      </md-card-header>

      <md-card-content>
                <md-table>

                <md-table-row>
                    <md-table-cell >转账时间</md-table-cell>
                    <md-table-cell>{{time}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >from</md-table-cell>
                    <md-table-cell>{{from}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >to</md-table-cell>
                    <md-table-cell>{{to}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >value</md-table-cell>
                    <md-table-cell>{{value}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >memo</md-table-cell>
                    <md-table-cell>{{memo}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >确认区块高度</md-table-cell>
                    <md-table-cell>{{height}}</md-table-cell>
                </md-table-row>
                </md-table>
      </md-card-content>

    </md-card>
</template>
<script>
import {eos} from '../main';
//var count=0;
    export default {
        data(){
          return{
            time:"",
            from:"",
            to:"",
            value:"",
            memo:"",
            height:"",
          }
        },
        created:{
        },
        computed:{
           triger:function(){this.getInfo();return this.transaction},
        },
        watch:{
          '$route':'getParams'
        },
        methods: {
          getParams(){
            let tranId=this.$route.params.transactionId;
            console.log(tranId)
            this.transaction=tranId;
          },

         async getInfo(){
            let tranId=this.$route.params.transactionId;
            this.transaction=tranId;
            eos.getTransaction({id:this.transaction}).then(res=>{
              console.log(res);
                this.block=res.block_num;
                this.timestamp=res.block_time;
                this.status=res.trx.receipt.status;
                this.cpu=res.trx.receipt.cpu_usage_us;
                this.net=res.trx.receipt.net_usage_words;
                this.NumberofActions=res.traces.length;
            });
          
          }
        }
    }
</script>