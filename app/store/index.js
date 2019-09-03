import Vue from 'vue'
import Vuex from 'vuex'

import session from './modules/session'
import feed from './modules/feed'
import wizard from './modules/wizard'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    session: session,
    feed: feed,
    wizard: wizard
  }
})
