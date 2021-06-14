import Vue from 'vue'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import NotFound from '../components/NotFound.vue'
import Board from '../components/Board.vue'
import Card from '../components/Card.vue'
import VueRouter from 'vue-router'

import store from '../store'

Vue.use(VueRouter) 

const requireAuth = (to, from, next) => {
  //localstorage에 토큰여부 체크
  const loginPath = `/login?rPath=${encodeURIComponent(to.path)}` //login이후 to.path로 리다이렉트'
  store.getters.isAuth ? next() : next(loginPath) 
  //login토큰값이 있으면 next 라우팅 로직 수행, 없으면 로그인경로로 이동
}

const router = new VueRouter({  
  mode : 'history', 
  routes : [
    { path: '/', component: Home, beforeEnter : requireAuth },
    { path: '/login', component: Login },
    { path: '*', component : NotFound, beforeEnter : requireAuth },
    { path: '/b/:bid'
      , component: Board
      , beforeEnter : requireAuth
      , children : [
        { path: 'c/:cid', component: Card, beforeEnter : requireAuth }
      ] 
    },
    
  ]
})

export default router

/*
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Login from '../components/Login'
import Board from '../components/Board'
import Card from '../components/Card'
import NotFound from '../components/NotFound'
import store from '../store'

Vue.use(VueRouter)

const requireAuth = () => (from, to, next) => {
  !!store.state.accessToken ? 
    next() :
    next(`/login?returnPath=${encodeURIComponent(from.path)}`)
}

export default new VueRouter({
  routes: [{
    path: '/', 
    component: Home, 
    beforeEnter: requireAuth() 
  }, { 
    path: '/login', 
    component: Login 
  }, { 
    path: '/board/:id', 
    component: Board, 
    beforeEnter: requireAuth(),
    children: [
      { 
        path: 'card/:cid', 
        component: Card 
      }
    ]  
  }, { 
    path: '*', 
    component: NotFound 
  }]
})
*/