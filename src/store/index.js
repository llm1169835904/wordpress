import { createStore } from 'vuex'

export default createStore({
  state: {
    addShow:false,
    loading:false,
    loadings:true,
    load:false,
    edit:false,
  },
  mutations: {
    setLoading(state,data){
      state.loading=data
    },
    setLoadings(state,data){
      state.loadings=data
    },
    setEdit(state,data){
      state.edit=data
    },
    setLoad(state,data){
      state.load=data
    }
  },
  actions: {
  },
  modules: {
  }
})
