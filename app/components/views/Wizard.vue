<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout columns="*,6*">
        <Button class="fas wizard-btn action-btn" col="0" text.decode="&#xf104;" @tap="backButtontap" />
        <Label class="action-bar-title" col="1" text="FLVR Wizard"></Label> 
      </GridLayout>
      
    </ActionBar>

    <GridLayout rows="8*,*">
    
      <Map row="0" mode="wizard" v-bind:post="post"></Map>

      <GridLayout class="wizard-tools" row="1" columns="*,*,*,*,*">
        <Button class="fas wizard-btn" col="0" text.decode="&#xf565;" @tap="swipePostLeft" />
        <Button class="fas wizard-btn" col="1"  text.decode="&#xf004;" @tap="swipePostLeft" />
        <Button class="fas wizard-btn" col="2"  :text="post.markers.length" @tap="swipePostLeft" />
        <Button class="far wizard-btn" col="3"  text.decode="&#xf2ed;" @tap="resetRecording" />
        <Button class="far wizard-btn" col="4" text.decode="&#xf058;" @tap="savePost" />
      </GridLayout>

    </GridLayout>      
      
  </Page>

  <!-- <Map :focusedPostId="focusedPostId"/>   -->
</template>

<script>

  import Home from '../Home';
  import Map from '../tools/map/Map';
  import { mapState, mapGetters, mapActions } from 'vuex';

  export default {
    components: {
      Map
    },
    data(){
      return {
        focusedPostId: false  
      }
    },
    methods:{
      ...mapActions({
        resetRecording: 'resetRecording',
        updateList: 'updateList'
      }),
      backButtontap(){

        this.$navigateTo(Home, {
          transition: {
            name: 'slideRight'
          }
        });

      },
      savePost(){

        this.post.save();
        this.resetRecording();
        this.updateList();
        this.backButtontap();

      }
    },
    computed: {
      // ...mapState({
      //   postList: state => state.feed.list,
      // }),
      ...mapState({
        post: state => state.wizard.post
      }),
      // currentPost(){
      //   return this.getPost(this.focusedPostId);
      // }
    },
    created() {

      // this.focusedPostId = this.focusedPostId || this.postList[0].id;


    },
    mounted(){


    }
  }
</script>

<style scoped lang=scss>

  @import '@/resources/theme/colors.scss';

  .wizard-btn {

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
  }

  .action-btn {

    background-color: transparent;
    color: $white;

  }

  .wizard-btn:highlighted{
    color:$blue;
    transition: all 0.2s ease;
    background-color: darken($light_gray,20%);
  }

  .wizard-btn.error {

    color: $red;

  }

  .wizard-tools {

    padding: 0;
    margin: 0;
    z-index: 1;
    position: relative;
    border-top-color: $black;
    border-top-width: 2;

  }

  .wizard-map {

    position: relative;
    z-index: 0;

  }

</style>
