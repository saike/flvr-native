<template>
  <GridLayout rows="8*,*">
    
    <Map class="feed-map" row="0" mode="feed" v-bind:post="currentPost"></Map>

    <GridLayout class="feed-tools" row="1" columns="*,*,*,*,*">
      <Button class="fas feed-btn" col="0" text.decode="&#xf0a8;" @tap="swipePostLeft" />
      <Button class="fas feed-btn" col="1"  text.decode="&#xf004;" @tap="swipePostLeft" />
      <GridLayout class="feed-btn" col="2"  cols="*">
       <Button col="0"  class="fas feed-btn post-btn" v-bind:class="{ error: !locationEnabled, recording: locationEnabled && recording, paused: locationEnabled && !recording }" v-class-toggler="success" text.decode="&#xf54b;" @tap="wizardTap" @longPress="toggleRecording" />
      </GridLayout>
      <Button class="fas feed-btn" col="3"  text.decode="&#xf075;" @tap="swipePostLeft" />
      <Button class="fas feed-btn" col="4" text.decode="&#xf0a9;" @tap="swipePostRight" />
    </GridLayout>

  </GridLayout>
  <!-- <Map :focusedPostId="focusedPostId"/>   -->
</template>

<script>

  import Wizard from './Wizard';

  import Map from '../tools/map/Map';
  import { mapState, mapGetters, mapActions } from 'vuex';
  import * as geolocation from "nativescript-geolocation";

  export default {
    components: {
      Map
    },
    data(){
      return {
      }
    },
    methods:{
      // focusPost(postId){
        
      //   // this.focusedPostId = postId;

      //   console.log('post id:', this.currentPost.id);
      

      // },
      ...mapActions({
        focusPost: 'setCurrent',
        locationPermissionsRequest: 'locationPermissionsRequest',
        updateList: 'updateList',
        stopRecording: 'stopRecording',
        startRecording: 'startRecording'
      }),
      toggleRecording(event){

        console.log(event);

        if(this.recording) {
          this.stopRecording();
        }
        else {
          this.startRecording();
        }

      },
      swipePostLeft(){

        let current_index = this.postList.indexOf(this.currentPost);

        let new_index;

        if(current_index > 0) {
          new_index = current_index - 1;
        }
        else {
          new_index = this.postList.length-1;
        }

        console.log(this.postList[new_index].id);

        this.focusPost(this.postList[new_index].id);

      },
      swipePostRight(){

        let current_index = this.postList.indexOf(this.currentPost);

        let new_index;

        if(current_index < this.postList.length-1) {
          new_index = current_index + 1;
        }
        else {
          new_index = 0;
        }

        this.focusPost(this.postList[new_index].id);

      },
      async wizardTap(){

        let acessed = this.locationEnabled;
  
        if(!acessed) {


          try {

            acessed = await this.locationPermissionsRequest();

          }
          catch(e){

            console.log("Error: " + (e.message || e));

          }

        }

        if(acessed) {

          // console.log('location accessed');   

          this.$navigateTo(Wizard, {
            transition: {
              name: 'slideLeft'
            }
          });    

        }
        

      }
    },
    computed: {
      ...mapState({
        postList: state => state.feed.list,
        focusedPostId: state => state.feed.current,
        locationEnabled: state => state.wizard.enabled,
        recording: state => state.wizard.recording
      }),
      ...mapGetters({
        getPost: 'getPost',
        currentPost: 'currentPost'
      })
    },
    created() {

      // this.focusedPostId = (this.postList[0] && this.postList[0].id) || this.focusedPostId;

      // return true;


    },
    mounted(){

      this.updateList();  

    }
  }
</script>

<style scoped lang="scss">

  @import '@/resources/theme/colors.scss';

  .feed-btn {

    font-size: 27;
    margin: 0;
    box-shadow: none;
    background-color: $light_gray;
    border: none;
    border-width: 0.1;
    color: $black;
    z-index: 0;
    transition: all 0.2s ease;
    border-color: transparent;
    position: relative;
  }

  .feed-btn:highlighted{
    color:$blue;
    transition: all 0.2s ease;
    background-color: darken($light_gray,20%);
  }

  .feed-btn.error {

    color: $red;

  }

  .feed-btn.recording, .feed-btn.paused.success {
    color: $green;
  }

  .feed-tools {

    padding: 0;
    margin: 0;
    z-index: 1;
    position: relative;
    border-top-color: $black;
    border-top-width: 2;

  }

  .feed-map {

    position: relative;
    z-index: 0;

  }

  .feed-btn.post-btn {

    rotate: -90;  

  }

</style>
