<template>
  <v-app>
    <div data-app id="app">
      <moon-loader class="spinner" :loading="loading" :color="color" :size="size"></moon-loader>
      <div class="home">
        <v-layout row wrap>
          <v-flex md12 class="menu">
            <div class="timer">
              <div>
                {{time}}
              </div>
              <div v-if="activeChrono" class="chrono-style">
               / {{showChrono}}
              </div>
            </div>
            <div class="buttons-container">
              <button class="button-style start-btn" v-if="statusChrono===cns.STATUS_CHRONO.STOP" @click="startChrono()">
                Entrar
              </button>
              <div v-else class="position-buttons">
                <button class="button-style" :class="{'pause-btn': statusChrono === cns.STATUS_CHRONO.START, 'start-btn': statusChrono === cns.STATUS_CHRONO.PAUSE}" @click="pauseChrono()">
                  <span v-if="statusChrono === cns.STATUS_CHRONO.START"> Pausar </span>
                  <span v-else> Continuar </span>
                </button>
                <button class="button-style stop-btn" v-if="tatusChrono !== cns.STATUS_CHRONO.STOP" @click="stopChrono()">
                  Salir
                </button>
              </div>
            </div>
            <div class="position-profile">
              <v-badge bordered overlap dot :color="colorBadge" class="position-img" offset-x="14" offset-y="20">
                <img class="imgProfile" :src="picture" alt="Kelly Pierce">
              </v-badge>
              
              <div>{{employeeName}}</div>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                     <v-icon id="icon-dropdown" class="icon-dropdown">arrow_drop_down</v-icon>
                  </v-btn>
                </template>
                <v-list class="list-item-style" v-if="menuItems">
                  <v-list-item v-for="(itemMenu, indexI) in menuItems" :key="indexI">
                    <v-menu nudge-left="320" v-if="itemMenu.id == 'accounts'">
                      <template v-slot:activator="{ on, attrs }">
                        <div class="btn-second-level" v-bind="attrs" v-on="on">
                            <v-icon id="icon-dropdown" class="icon-dropdown dropdown-position">chevron_left</v-icon><span>{{itemMenu.text}}</span>
                        </div>
                      </template>
                      <v-list class="list-item-style">
                        <v-list-item class="time-register-item" v-for="(sesion, indexS) in sesionsList" :key="indexS">
                          <div class="sesion-icon">
                            S{{sesion.number}}
                          </div>
                          <div>
                            <div>
                              <span class="sesion-text">{{sesion.text}}</span><span class="sesion-name"> {{sesion.name}}</span>
                            </div>
                            <div class="sesion-time">
                              Hoy llevas {{sesion.time}}
                            </div>
                          </div>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-list-item-title v-else>{{itemMenu.text}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

          </v-flex>
        </v-layout>
        <div v-if="statusChrono === cns.STATUS_CHRONO.PAUSE">
          <v-alert outlined type="warning" prominent border="left">
            El botón de pausa actua solo de forma visual ya que no existe ningún servicio para poner el estado en "paused". En caso de refrescar la página se volverá a obtener el tiempo real.
          </v-alert>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import homeServices from './HomeServices.js';
import cns from '../../components/common/cns.js'

export default {
  name: 'Home',

  data() {
        return {
          cns:cns,
          loading: false,
          color: "#5EBEA3",
          size: "75",
          employeeName: "Kelly Pierce",
          time: null,
          interval: null,
          initialState: null,
          min: 0,
          contSeg: 0,
          contMin: 0,
          contHours: 0,
          chrono: null,
          intervalChrono: null,
          showChrono: "00:00:00",
          statusChrono: cns.STATUS_CHRONO.STOP,
          activeChrono: false,
          picture: null,
          colorBadge: "red",
          menuItems: [{ id: "accounts", text: "Mis cuentas" }, { id: "employee", text: "Vista empleado" }, { id: "profile", text: "Mi perfil" }, { id: "closeSesion", text: "Cerrar sesión" }],
          sesionsList: [{ number: 1, text: "Sesame1", name: "Kelly Pierce", time: "00:00" }, { number: 2, text: "Sesame2", name: "Kelly Pierce", time: "00:00" }]
        }
    },
  components: {
  },
  computed:{
  },
  created(){
    this.startTime();
    this.interval = setInterval(() => this.startTime(), 1000);
    this.getRandomUser();
    this.getStatus();
  },
  methods:{

    getStatus(){
      this.loading = true;
      homeServices.getUserWorkStatus().then((response) => {
        this.initialState = response.data.data[0].employee.workStatus;
        
        if(this.initialState == 'online'){
          this.statusChrono = cns.STATUS_CHRONO.START;
          this.colorBadge = "green";
          const actualTime = new Date(response.data.data[0].workEntryIn.date);
          this.functionmsToTime(new Date(), this.getUTCDate(actualTime))
          this.intervalChrono = setInterval(() => this.chronometer(), 1000);
          this.activeChrono = true;
        }
        this.loading = false;
      }).catch(function (error) {
        console.log(error)
        this.loading = false;
      });
    },
    getUTCDate(date){
      let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds());
      return now_utc;
    },
    functionmsToTime(actualDate, initalDate){
      let duration = actualDate - initalDate;
      let seconds = Math.floor((duration / 1000) % 60);
      let minutes = Math.floor((duration / (1000 * 60)) % 60);
      let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      this.contHours = hours;
      this.contMin = minutes;
      this.contSeg = seconds;
    },
    checkTime(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
    },
    startTime() {
      let today = new Date();
      let hr = today.getHours();
      let min = today.getMinutes();
      let sec = today.getSeconds();
      hr = this.checkTime(hr);
      min = this.checkTime(min);
      sec = this.checkTime(sec);
      this.time = hr + ":" + min + ":" + sec;
    },
    chronometer(){
      if(this.contSeg == 59){
          this.contSeg = 0;
          this.contMin++;

          if(this.contMin == 59){
              this.contMin = 0;
              this.contHours++;
          }
      }else{
        this.seg = this.contSeg;
        this.contSeg++;
      }
      this.showChrono = this.checkTime(this.contHours) + ':' + this.checkTime(this.contMin) + ':' + this.checkTime(this.contSeg); 
    },
    startChrono(){
      if (this.statusChrono === cns.STATUS_CHRONO.STOP){
        this.contSeg = 0;
        this.contMin = 0;
        this.contHours = 0;
        this.showChrono = "00:00:00";
      }
      if (this.statusChrono != cns.STATUS_CHRONO.PAUSE){
        this.loading = true;
        homeServices.postClockIn("b99a6cd9-3a3d-4635-9eea-e089c90ac45a").then((response) => {
          console.log(response)
          this.loading = false;
        }).catch(function (error) {
          this.loading = false;
          console.log(error)
        });
      }
      this.statusChrono = cns.STATUS_CHRONO.START;
      this.colorBadge = "green";
      this.intervalChrono = setInterval(() => this.chronometer(), 1000);
      this.activeChrono = true;
    },
    pauseChrono(){
      if(this.statusChrono === cns.STATUS_CHRONO.PAUSE){
        this.startChrono();
      }else{
        this.statusChrono = cns.STATUS_CHRONO.PAUSE;
        clearInterval(this.intervalChrono);
      }
    },
    stopChrono(){
      this.loading = true;
      this.statusChrono = cns.STATUS_CHRONO.STOP;
      this.colorBadge = "red";
      clearInterval(this.intervalChrono);
      homeServices.postClockOut("b99a6cd9-3a3d-4635-9eea-e089c90ac45a").then((response) => {
        console.log(response)
        this.loading = false;
      }).catch(function (error) {
        console.log(error)
        this.loading = false;
      });
    },
    getRandomUser(){
      homeServices.getRandomUsers().then((response) => {
        this.picture = response.data.results[0].picture.large;
      }).catch(function (error) {
        console.log(error)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.menu{
    background-color: #ECECEC;
    border-radius: 100px;
    width: 100%;
    height: 48px;
    display: flex;
    gap: 32px;
    align-items: center;
    margin: 16px;
    padding: 16px;
  }
  .timer{
    display: flex;
    gap: 4px;
    align-items: center;
  }
    .button-style{
      width: 110px;
      height: 28px;
      color: #FFFFFF;
      border-radius: 100px;
      cursor: pointer;
      margin: 12px;
    }
    .start-btn{
      background-color: #5EBEA3;
    }
    .pause-btn{
      background-color: #B5B5B5;
    }
    .stop-btn{
      background-color: #FF9984;
    }
    .chrono-style{
      width: 80px;
      color: #B5B5B5
    }
    #icon-dropdown.icon-dropdown{
      color: #000000;
    }
    #icon-dropdown.dropdown-position{
      position: absolute;
      left: 0;
    }
  .position-buttons{
    display: flex;
  }
    .position-profile{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
    }
    .list-item-style .v-list-item{
      width: 300px;
      text-align: center;
      font-weight: 500;
      cursor: pointer;
    }
    .list-item-style .v-list-item:hover {
      background-color: #caece2;
    }

.btn-second-level{
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}
  .imgProfile {
    height: 32px;
    width: 32px;
    background-repeat: no-repeat;
    background-position: 50%;
    border-radius: 50%;
    background-size: 100% auto;
    margin-right: 8px;
  }

  .time-register-item{
    display: flex;
    align-items: center;
    gap: 8px;
    .sesion-icon{
      height: 24px;
      width: 24px;
      border-radius: 50%;
      border: solid 1px #B5B5B5;
      background-color: #E7E7E7;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #B5B5B5;
    }
    .sesion-text{
      color: #5D5D5D;
      font-weight: 600;
      font-size: 14px;
    }
    .sesion-name{
      color: #5D5D5D;
      font-weight: 100;
      font-size: 14px;
    }
    .sesion-time{
      color: #B5B5B5;
      font-weight: 100;
      font-size: 12px;
      text-align: left;
    }
  }

  .position-img{
    margin-right: 8px;
  }
  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    margin: auto auto;
    z-index: 9999;
    position: fixed;
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
