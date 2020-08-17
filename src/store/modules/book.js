const book = {
  state: {
    test:1
  },
  mutations: {
    set_test(state,newTest) {
      state.test = newTest
    }
  },
  actions: {
    setTest({ commit, state }, newTest) {
      // console.log(state.test,newTest)
      return commit('set_test',newTest)
    }
  },
  modules: {
  }
}
export default book