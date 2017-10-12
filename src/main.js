// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import App from './App';
import router from './routers/routers.js';

import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isSearch: false
  },
  mutations: {
    changeIsSearch (state) {
      state.isSearch = !state.isSearch;
    }
  }
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app-box')
