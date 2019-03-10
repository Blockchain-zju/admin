<template>
    <md-card>
      <md-card-header>
        <div class="md-title">Transaction Infomation</div>
      </md-card-header>

      <md-card-content>
                <md-table>

                <md-table-row>
                    <md-table-cell >Transaction ID</md-table-cell>
                    <md-table-cell>{{triger}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Block Number</md-table-cell>
                    <md-table-cell>{{block}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >时间戳</md-table-cell>
                    <md-table-cell>{{timestamp}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Status</md-table-cell>
                    <md-table-cell>{{status}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >CPU Usage</md-table-cell>
                    <md-table-cell>{{cpu}}us</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Net Usage</md-table-cell>
                    <md-table-cell>{{net}}words</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell >Number of Actions</md-table-cell>
                    <md-table-cell>{{NumberofActions}}</md-table-cell>
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
            transaction:"",
            block:"",
            timestamp:"",
            cpu:"",
            NumberofActions:"",
            status:"",
            net:"",
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