import * as api from '../api'
import state from './state'

const actions = {
  LOGIN({commit},{email,password}){
    return api.auth.login(email,password).then(
      ({accessToken}) => commit('LOGIN',accessToken)
    )
  }
  ,ADD_BOARD(_,{title}){ //context,입력객체
    return api.board.create(title).then(data => data.item)
  }
  ,FETCH_BOARDS({commit}){ //context-commit으로 boards 상태 변이
    return api.board.fetch().then(data => {
      commit('SET_BOARDS',data.list)
    })
  }
  ,FETCH_BOARD({commit},{id}){
    return api.board.fetch(id).then(data => {
      commit('SET_BOARD',data.item)
    })
  }
  ,DELETE_BOARD(_,{id}){
    return api.board.delete(id)
  }
  ,UPDATE_BOARD({dispatch,state},{id,title,bgColor}){
    return api.board.update(id,{title,bgColor}).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  ,FETCH_CARD({commit},{cardId}){
    return api.card.fetch(cardId).then(data => {
      commit('SET_CARD',data.item)
    })
  }
  ,ADD_CARD({dispatch, state},{title,listId,pos}){
    return api.card.create(title,listId,pos).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  ,UPDATE_CARD({dispatch, state},{cardId,title,description,listId,pos}){
    return api.card.update(cardId,{title,description,listId,pos}).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  ,DELETE_CARD({dispatch, state},{cardId}){
    return api.card.delete(cardId).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  ,ADD_LIST({dispatch,state},{title,boardId,pos}){
    return api.list.create({title,boardId,pos}).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  ,UPDATE_LIST({dispatch,state},{listId,title,pos}){
    return api.list.update(listId,{title,pos}).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  ,DELETE_LIST({dispatch,state},{listId}){
    return api.list.delete(listId).then(() => {
      dispatch('FETCH_BOARD',{id : state.board.id})
    })
  }
  /*
  LOGIN({ commit }, { email, password }) {
    return auth.login(email, password)
      .then(({ accessToken }) => commit('LOGIN', { accessToken }))
  },
  FETCH_BOARD_LIST ({commit}) {
    return board.fetch()
      .then(data => commit('SET_BOARD_LIST', data))
  },
  FETCH_BOARD ({commit}, id) {
    return board.fetch(id)
      .then(data => commit('SET_BOARD', data))
  },
  ADD_BOARD (_, title) {
    return board.create(title)
      .then(({item}) => item.id)
  },
  UPDATE_BOARD({ state, dispatch }, { id, title, bgColor }) {
    return board.update(id, { title, bgColor })
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },  
  DELETE_BOARD(_, id) {
    return board.destroy(id)
  },

  ADD_LIST ({state, dispatch}, {title, boardId, pos}) {
    return list.create({title, pos, boardId})
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  UPDATE_LIST ({ state, dispatch }, {id, pos, title}) {
    return list.update(id, { pos, title })
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },  
  DELETE_LIST ({ state, dispatch }, { id, pos, title }) {
    return list.destroy(id, { pos, title })
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  
  FETCH_CARD ({commit}, id) {
    return card.fetch(id)
      .then(({item}) => commit('SET_CARD', item))
  },
  ADD_CARD ({state, dispatch}, {title, pos, listId}) {
    return card.create({title, pos, listId})
      .then(_=> dispatch('FETCH_BOARD', state.board.id))
  },
  UPDATE_CARD({ state, dispatch }, {id, pos, title, description, listId}) {
    return card.update(id, { pos, title, description, listId})
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
    },
  DELETE_CARD({state, dispatch}, id) {
    return card.destroy(id)
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  */
}

export default actions 