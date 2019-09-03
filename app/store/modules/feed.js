import Post from '../../models/Post';


// const seed_feed = [
//   {
//     id: 1,
//     create_date: 1566300000000,
//     markers: [
//       [ 51.55747, 44.41222  ],
//       [  51.54, 44.39222  ],
//       [ 51.51, 44.40222   ],
//       [ 51.46, 44.45222 ],
//       [ 51.52, 44.48222   ]
//     ]
//   },
//   {
//     id: 2,
//     create_date: 1566400000000,
//     markers: [
//       [ 51.55747, 44.53222  ],
//       [ 51.57, 44.52222   ],
//       [ 51.59, 44.50222   ],
//       [ 51.61 , 44.50222  ],
//       [ 51.60, 44.48222   ]
//     ]
//   },
//   {
//     id: 3,
//     create_date: 1566500000000,
//     markers: [
//       [ 51.60, 44.36  ],
//       [ 51.63, 44.38   ],
//       [ 51.62, 44.38   ],
//       [ 51.63, 44.40   ],
//       [ 51.65, 44.41   ]
//     ]
//   }
// ];

// let parsed_list = seed_feed.map(item => new Post(item));

const state = {
  list: [],
  current: false,
  viewport: {
    center: [0,0],
    zoom: 0
  }
};

const getters = {
  getList (state) {
    return state.list
  },
  getPost: state => postId => {
    return state.list.find(post => post.id === postId);
  },
  currentPost: (state,getters) => getters.getPost(state.current)
};

const mutations = {
  setList: function (state, list) {

    if(!list) return;

    state.list = list;
    console.log('LIST', list[0]);
    state.current = list[0] && list[0].id || false;
  },
  setCurrent: function(state, payload) {
    state.current = payload;
  },
  setViewport: function(state, payload) {
    state.viewport = payload;
  }
};

const actions = {
  updateList: function ({commit}, payload) {

    let list = Post.list();
    commit('setList', list)
  },
  setCurrent: function ({commit}, payload) {
    commit('setCurrent', payload)
  },
  setViewport: function ({commit}, payload) {
    commit('setViewport', payload)
  }
};

export default {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
