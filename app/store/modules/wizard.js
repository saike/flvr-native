import Post from '../../models/Post';
const geolocation = require("nativescript-geolocation");
// import * as geolocation from 'nativescript-geolocation';
import { Accuracy } from "tns-core-modules/ui/enums";
import { setInterval, clearInterval } from 'tns-core-modules/timer';

class GPSgenerator {
  constructor(){

    this.history = [];

    this.averaged_position = false;

  }
  randomPoint(){

    const getRandomInRange = function(from, to, fixed) {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
      // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }

    return {
      latitude: getRandomInRange(-90, 90, 3),
      longitude: getRandomInRange(-90, 90, 3),
      timestamp: new Date().getTime()
    };

  }
  async getCurrentLocation(){

    const generate_delta = function(){
  
      let high = 0.001
  
      var random = -high + Math.random() * (high - -high);
  
      return random;
  
    };

    let marker; 

    if(this.history.length === 0) {
      marker = this.randomPoint();
      this.averaged_position = marker;
      this.history.push(marker);
    } 
    else {

      // let last_marker = this.history[this.history.length-1];
      let delta_error = Math.random() < 0.2 ? 1 : (Math.random()*10)-4;

      marker = {
        latitude: this.averaged_position.latitude + (generate_delta()*delta_error),
        longitude: this.averaged_position.longitude + (generate_delta()*delta_error),
        timestamp: new Date().getTime()
      };

      if(delta_error === 1) {

        this.averaged_position = marker;

      }


      this.history.push(marker);

    }

    return marker;

  }
}

let gps_generator = new GPSgenerator();

let new_post = new Post();
// new_post.markers = Post.generateSeedMarkers(100);
// console.log(new_post.markers.length);

const state = {
  post: new_post,
  enabled: false,
  recording: false,
  checker: false,
  mode: 'prod'
};

const getters = {
  // locationEnabled (state) {

  //   return geolocation.isEnabled();

  // },
  // getPost: state => postId => {
  //   return state.list.find(post => post.id === postId);
  // }
};

const mutations = {
  enable: function (state) {
    state.enabled = true;
  },
  disable: function(state) {
    state.enabled = false;
  },
  startRecording(state, interval){

    state.checker = interval;
    state.recording = true;

  },
  stopRecording(state){

    if(state.checker) {

      state.recording = false;

      clearInterval(state.checker);
      state.checker = false;

    }

  },
  resetRecording(state){
    gps_generator.history = [];
    state.post = new Post();
  },
  addMarker(state, marker) {

    // console.log('add marker to post', state.post);

    if(state.post){

      state.post.addMarker(marker);
      console.log('add marker: ', state.post.markers.length);

    }

  }
};

const actions = {
  updateList: function ({commit}, payload) {
    commit('setList', payload)
  },
  enable: function ({commit}) {
    
    return geolocation.isEnabled().then((enabled)=>{

      // console.log('enabled?', enabled);
      enabled && commit('enable');

      return enabled;

    }, (err)=>{

      console.error('isEnabled', err);
      return err;

    });
  },
  disable: function ({commit}) {
    commit('disable');
  },
  startRecording: function ({commit, state}) {

    let checker;

    switch (state.mode) {
      case 'prod':
        
        checker = setInterval(() => {

          console.log('interval rec', state.enabled);
    
          if(!state.enabled) return;
    
          geolocation.getCurrentLocation({desiredAccuracy: Accuracy.high, updateTime: 0, minimumUpdateTime: 0, updateDistance: 1, maximumAge: 0, timeout: 4000}).then((loc) => {
    
            // console.log(loc);
            commit('addMarker', [ loc.latitude, loc.longitude, loc.timestamp.getTime() ]);   
    
          });
    
        }, 10000);

        break;
      case 'dev':

        checker = setInterval(() => {

          // console.log('interval rec', state.enabled);
    
          if(!state.enabled) return;
    
    
    
          gps_generator.getCurrentLocation().then((loc) => {
    
            // console.log(loc);
            commit('addMarker', [ loc.latitude, loc.longitude, loc.timestamp ]);   
    
          });
    
        }, 2000);

        break;
      default:
        break;
      }


    commit('startRecording', checker);

  },
  stopRecording: function ({commit}) {
    commit('stopRecording')
  },
  resetRecording: function({commit}){
    commit('resetRecording');  
  },
  locationPermissionsRequest({commit}){

    return geolocation.enableLocationRequest().then(()=>{

      // console.log('permissions access:');

      commit('enable');

      return true;

    }, (err) => {

      console.error(err);
      commit('disable');
      return err;

    })

  }
};

export default {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
