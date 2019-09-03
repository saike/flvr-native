//app name:
//surface

import Vue from "nativescript-vue";
import { mapActions } from "vuex";
import store from './store'
import './vue/directives/directives';
import './vue/background-service';

import Home from "./components/Home";

Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);
Vue.registerElement('MapView', () => require('nativescript-google-maps-sdk').MapView);

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    },
    methods: {
        ...mapActions({
            startRecording:  'startRecording',
            stopRecording:  'stopRecording',
            enable: 'enable'
        })
    },
    created: function () {

        setTimeout(async ()=>{

            let enabled = await this.enable();

            this.startRecording();

            // console.log('app created', enabled);
            return enabled;

        }, 200);

    },
    beforeDestroy: function(){
        this.stopRecording();
    },
    store: store
}).$start();
