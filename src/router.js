import Vue from 'vue';
import Router from 'vue-router';
import About from './components/About.vue';
import Crypto from './components/Crypto.vue';
import Currencies from './components/Currencies.vue';
import Skills from './components/Skills.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/skills',
      name: 'skills',
      component: Skills
    },
    {
      path: '/',
      name: 'about',
      component: About
    },
    {
      path: '/crypto',
      name: 'crypto',
      component: Crypto
    },
    {
      path: '/currencies',
      name: 'currencies',
      component: Currencies
    }
  ]
})
