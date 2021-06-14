import Vuex from 'vuex'
import Vue from 'vue'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state
  ,getters
  ,mutations
  ,actions
})

//어플리케이션 구동 시, 로컬스토리지 체크해서 로그인처리
const token = localStorage.token
store.commit('LOGIN',token)

export default store