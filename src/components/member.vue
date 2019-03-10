<template>
<div>
    <md-card md-with-hover>
      <md-ripple>
        <md-card-header>
                  <md-card-header-text>
                    <div class="md-title" >协会成员</div>
                  </md-card-header-text>

                  <md-menu md-size="big" md-direction="bottom-end">
                      <md-button><router-link to="/regis">{{message}}</router-link></md-button>
                  </md-menu>
        </md-card-header>


        <md-card-content>
        <md-progress-spinner v-if="ok" md-mode="indeterminate" style="margin-left:35vw"></md-progress-spinner>
        <md-table v-else v-model="members" md-fixed-header md-card @md-selected="onSelect">
        <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
            <md-table-cell md-label="姓名" md-sort-by="id" >{{ item.name }}</md-table-cell>
            <md-table-cell md-label="学号" md-sort-by="id">{{ item.studentid }}</md-table-cell>
            <md-table-cell md-label="EOS账号" md-sort-by="id" >{{ item.eosid }}</md-table-cell>
            <md-table-cell md-label="注册时间" md-sort-by="id" >{{ item.registime }}</md-table-cell>
        </md-table-row>
        </md-table>
        </md-card-content>

      </md-ripple>
    </md-card>
 
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
import {eos} from '../main'
export default {
    data(){
        return{
            members:[],
            ok:1,
        }
    },
    computed:{
      message:function(){this.getmembers();return "注册"}
    },
    methods:{
        async getmembers(){
          await eos.getTableRows({code: "zjubcatest12",scope:"zjubcatest12",table:"members",json:"true"}).then(res=>{
            let nn=res.rows.length;
            let ii;
            for(ii=0;ii<nn;ii++){
                this.members[ii]={
                  "name":res.rows[ii].studentname,
                  "studentid":res.rows[ii].studentid,
                  "eosid":res.rows[ii].eosaccount,
                  "registime":res.rows[ii].registration_date,

                }             
            }
          
          });
          this.ok=!this.ok;
        },
        onSelect (item) {
        this.$router.push({name:'SearchAccount',
                           params: { 
                                Account: item.eosid
                            }});
      },
    }
}
</script>
