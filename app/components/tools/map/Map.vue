<template>
  <MapView
          width="100%"
          height="100%"
          dock="top"
          :zoom="viewport.zoom"
          :latitude="viewport.center[0]"
          :longitude="viewport.center[1]"
          @mapReady="onMapLoaded"
          @coordinateLongPress="locationSelected"
        />
</template>

<script>

  import { mapState } from 'vuex';
  import { Position, Marker, Polyline, Bounds, Circle } from "nativescript-google-maps-sdk";
  import { Color } from 'tns-core-modules/color';
  import Post from '../../../models/Post';
  import simplify from '@mosch/simplify-js';

  export default {
    components: {

    },
    props: {
      post: Post,
      mode: String
    },
    watch: { 
      // post: {
      //   immediate: false,
      //   handler(newVal, oldVal) { // watch it
  
      //     console.log('post change', newVal);
      //     oldVal && newVal && this.flyToPost(newVal);

      //   }
      // },
      postMarkers: {
        immediate: false,
        handler(newVal, oldVal) {

          // console.log('change markers', this.post, oldVal);

          if(this.post && this.map) {
            this.renderPost(this.post);
            // this.flyToPost(this.post);
          }
          // if(newVal !== oldVal && this.post && this.post.markers.length > 0) {

          //   this.renderPost(this.post)

          // }

        }
      } 
    },
    data(){
      return {

      }
    },
    methods:{
      onMapLoaded(args) {

        this.map = args.object;

        // this.map.gMap.mapType = 4;
        this.map.gMap.setMapType(4);

        if(!this.post){

          return;  

        }

        this.renderPost(this.post);

        // this.flyToPost(this.post);

        console.log(this.post.id);

        // for(let post of this.postList){

        //   console.log(post.id);

        //   this.renderPost(post.id);

        // }

        // this.postList.forEach((post, index) => {
        //   console.log(post.id, index);

        // });
        // or just to store if you want have access from other components
//        this.$store.map = event.map;
      },
      flyToPost(post){

        // console.log('flying to post:', post);

        if(!post) return;

        // let left = Math.min(...post.markers.map(marker=>marker[1]))-0.01;
        // let right = Math.max(...post.markers.map(marker=>marker[1]))+0.01;
        // let top = Math.max(...post.markers.map(marker=>marker[0]))+0.01;
        // let bottom = Math.min(...post.markers.map(marker=>marker[0]))-0.01;

        // console.log(`Flying to post: ${post.id}, bounds: ${[post.bounds.west, post.bounds.east, post.bounds.north, post.bounds.south].join(',')}`);

        // let bounds = Bounds.fromCoordinates(
        //     Position.positionFromLatLng(post.bounds.south, post.bounds.west),
        //     Position.positionFromLatLng(post.bounds.north, post.bounds.east)
        // );

        // this.map.setViewport(bounds,60);

        this.renderPost(post);

      }, 
      renderPost(post){

        if(!post || post.markers.length < 1) return;

        let map = this.map;

        map.removeAllPolylines();
        map.removeAllShapes();

        map.removeAllMarkers();

        let post_line = new Polyline();

        const POLYLINE_WIDTH = 24;
        const POLYLINE_COLOR = new Color(this.lineColor);
        const POLYLINE_FILL_COLOR = new Color('#FDFFFC');

        let markers = post.markers;

        // if(this.mode === 'wizard'){

        //   markers = simplify(post.normalizedMarkers.map(marker=>({y: marker[0], x: marker[1]})), 0.000001, true).map(marker => [ marker.y, marker.x ]);
        //   // markers = post.normalizedMarkers;
          
        // }

        console.log('rendering markers:', markers.length);

        markers.forEach((point, index) => {

          post_line.addPoint(Position.positionFromLatLng(point[0], point[1]));

          
          
        });
        
        post_line.visible = true;
        post_line.geodesic = true;
        post_line.width = POLYLINE_WIDTH;
        post_line.color = POLYLINE_COLOR;
        

        map.addPolyline(post_line);

        markers.forEach((point, index) => {

          // console.log(point);
          
          let prev_point = markers[index-1];

          let marker = new Marker();
          marker.position = Position.positionFromLatLng(point[0], point[1]);
          marker.visible = true;
          marker.draggable = false;
          if(prev_point) {

            let distance = Math.hypot(point[1]-prev_point[1], point[0]-prev_point[0]);
            let speed_mps = (distance/((point[2]-prev_point[2])/ 1000));
            let speed_kph = (speed_mps * 3600.0) / 1000.0;
            marker.title = speed_kph.toFixed(8).toString();
            console.log(distance, speed_mps, speed_kph, marker.title);  
          }


          map.addMarker(marker);

        });

        // //draw post markers
        [markers[0], markers[markers.length-1]].forEach(point => {

          // let marker = new Marker();
          // marker.position = Position.positionFromLatLng(point[0], point[1]);
          // marker.visible = true;
          // marker.draggable = false;
          // map.addMarker(marker);
          // console.log(point);


          // let circle = new Circle();

          // circle.center = Position.positionFromLatLng(point[0], point[1]);
          // circle.fillColor = POLYLINE_FILL_COLOR;
          // circle.strokeColor = POLYLINE_COLOR;

          // // circle.radius = Math.abs(post.bounds.west - post.bounds.east)*POLYLINE_WIDTH*150;
          // var p = Math.pow(2, (21 - this.viewport.zoom));
          // circle.radius = p * POLYLINE_WIDTH * 7 * 0.0027;
          // circle.strokeWidth = 16;
          // circle.zIndex = 1;

          // map.addCircle(circle);
          
        });

        return post;

      },   
    },
    computed: {
      viewport() {

        let post = this.post;


        if(!post) return {
          zoom: 5,
          center: [35,45]
        };

        // console.log('viewport', post);

        let bounds = post.bounds;
        
        // console.log('update viewport bounds', bounds);
     

        let west = bounds.west;
        let east = bounds.east;
        let angle = east - west;
        let north = bounds.north;
        let south = bounds.south;
        let angle2 = north - south;
        let zoomfactor;
        let delta = -0.6;
        let horizontal = false;
        const GLOBE_WIDTH = 256;

        if(angle2 > angle) {
            angle = angle2;
            delta = -0.6;
        }

        if (angle < 0) {
            angle += 360;
        }

        zoomfactor = Math.floor(Math.log(960 * 360 / angle / GLOBE_WIDTH) / Math.LN2) - 2 - delta;

        if(zoomfactor > 20) zoomfactor = 20;

        let center = [ (north+south)/2, (east+west)/2  ];

        console.log(center[0], center[1], zoomfactor  );

        return {
          zoom: zoomfactor,
          center: center
        };

      },
      lineColor(){

        switch(this.mode) {

          case 'wizard':

            return '#A9CEF4';
            break;

        }

        return '#3F7CAC';

      },
      postMarkers(){

        return this.post && this.post.markers || [];

      }
    },
    created() {

    },
    mounted(){

    }
  }
</script>

<style scoped lang="scss">

  // @import "../../assets/css/theme";

</style>
