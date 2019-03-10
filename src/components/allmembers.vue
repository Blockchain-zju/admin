<template>
<div>
    
    <md-card md-with-hover style="height:40vw">
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
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header @md-selected="onSelect">
        <md-table-toolbar>
            <div class="md-toolbar-section-start">
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
            </md-field>
        </md-table-toolbar>

        <md-table-empty-state
            md-label="No users found"
            :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`">
            <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button>
        </md-table-empty-state>
        
        <md-table-row  slot="md-table-row" slot-scope="{ item }" md-selectable="single">
            <md-table-cell md-label="姓名" md-sort-by="name" >{{ item.name }}</md-table-cell>
            <md-table-cell md-label="学号" md-sort-by="studentid">{{ item.studentid }}</md-table-cell>
            <md-table-cell md-label="EOS账号" md-sort-by="eosid" >{{ item.eosid }}</md-table-cell>
            <md-table-cell md-label="注册时间" md-sort-by="registime" >{{ item.registime }}</md-table-cell>
            <md-table-cell md-label="到期时间" md-sort-by="endtime" >{{ item.endtime }}</md-table-cell>
        </md-table-row>
        </md-table>
        </md-card-content>

      </md-ripple>
    </md-card>
</div>
</template>
<script>
  const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }

    return items
  }
  const getLocalTime=(nS) =>{     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}
import {eos} from '../main'
  export default {
    name: 'TableSearch',
    data: () => ({
      search: null,
      searched: [],
      users:[],
      ok:0,
    }),
    methods: {
      newUser () {
        this.$router.push({name:'regis',
                });
      },
      searchOnTable () {
        this.searched = searchByName(this.users, this.search)
      },
      async getMembers(){
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
      onSelect (item) {
        this.$router.push({name:'SearchAccount',
                           params: { 
                                Account: item.eosid
                            }});
      },
    },
    computed:{
        message:function(){this.getMembers();return "注册"}
    }
  }
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>
