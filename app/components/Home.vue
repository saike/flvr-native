<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="FLVR"></Label>
    </ActionBar>

    <TabView :selectedIndex="tabIndex">
      <TabViewItem title="Home">
        <StackLayout>
          <!-- <GridLayout>
            
            <Mapbox
              row="1"
              accessToken="pk.eyJ1Ijoic2Fpa2UiLCJhIjoiY2p6a3dzOXE3MG45dDNidWlvcG1kbHRmdCJ9.5bIP1rI_TVEm3LK7asY1_Q"
              :mapStyle="mapStyle"
              latitude="37.7397"
              longitude="-121.4252"
              hideCompass="true"
              zoomLevel="12"
              showUserLocation="false"
              disableZoom="false"
              disableRotation="false"
              disableScroll="false"
              disableTilt="false"
              @mapReady="onMapLoaded($event)"
            >

            </Mapbox> 
             
          </GridLayout> -->
          <Feed />

        </StackLayout>
      </TabViewItem>
      <TabViewItem title="Stars">
        <StackLayout>
          <Label title="Hello!"></Label>
        </StackLayout>
      </TabViewItem>
      <TabViewItem title="Search">
        <StackLayout>
          <Label text="Search tab" />
        </StackLayout>
      </TabViewItem>
      </TabViewItem>
      <TabViewItem title="Settings">
        <StackLayout>
          <Label text="Settings tab" />
        </StackLayout>
      </TabViewItem>
    </TabView>      
      
  </Page>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import Feed from './views/Feed';

export default {
  components: {
    Feed
  },
  data: function() {
    return {
      tabIndex: 0
    };
  },
  computed: {

  },
  methods:{
    
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
.fa {
  color: $accent-dark;
}

.info {
  font-size: 20;
}
</style>
