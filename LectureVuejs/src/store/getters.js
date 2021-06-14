const getters = {
  isAuth(state){ //login여부 확인
    return !!state.token //값 있으면 true
  }
  /*
  isAuthenticated(state) {
    return !!state.accessToken
  },
  hasBoardList(state) {
    return state.boardList.length > 0
  }
  */
}

export default getters