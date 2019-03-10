<template>
  <div id="app" class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary" style="display:flex">
              <div class="md-toolbar-row">
        <div class="md-toolbar-section-start" style="display:none">
          <md-button class="md-icon-button">
            <md-icon>menu</md-icon>
          </md-button>
        </div>
        <div class="md-toolbar-section-start" >
          <md-title>ZJUBCA</md-title>
        </div>
      </div>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-button class="md-icon-button md-dense md-primary">
            <md-icon><router-link to="/account">person</router-link></md-icon>
          </md-button>
            <!-- <md-button><router-link to="/sign">登陆</router-link></md-button> -->
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>home</md-icon>
            <span class="md-list-item-text"><router-link to="/">首页</router-link></span>
          </md-list-item>


          <md-list-item>
            <md-icon>verified_user</md-icon>
            <span class="md-list-item-text"><router-link to="/account">待生效交易</router-link></span>
          </md-list-item>

          <md-list-item>
            <md-icon>supervisor_account</md-icon>
            <span class="md-list-item-text"><router-link to="/kongtou">空投</router-link></span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

        <md-app-content >
          <router-view></router-view>
        </md-app-content>
    <footer >
		  zjubca.token 
    </footer>        
    </md-app>

  </div>
</template>

<style lang="scss" scoped>
  a{
    text-decoration:none;
  }
  .page-container{
    position:fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
  }
  .md-app {
    overflow: hidden;
    border: 1px solid rgba(rgb(0, 0, 0), .12);
    position:fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 500px);
  }
  #newitem {
    width: 50vw;
  }
  footer{
    text-align: center;
    border:1px rgb(107, 105, 105) dotted;
  }
</style>

<script>
import axios from 'axios';
export default {
  name: 'Normal',
  data(){
    return{
      Account:null,
    }
  },
  created:{
    
  },
  computed:{

  },
  methods:{

  }
}

</script>
