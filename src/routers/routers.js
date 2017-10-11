import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import MovieComponent from '../components/MovieComponent.vue';
import US_box from '../components/US_box.vue';

export default new Router({
  routes: [{
      path: '/',
      redirect: '/in_theaters'
    },
    {
      path: '/us_box',
      component: US_box
    },
    {
      path: '/:type',
      component: MovieComponent
    }
  ]
})
