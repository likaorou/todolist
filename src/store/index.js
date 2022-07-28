import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: 'test',
    nextId: 5,
    viewKey: '全部'
  },
  getters: {
    unDoneLength(state) {
      return state.list.filter(x => x.done === false).length
    },
    infoList(state) {
      if (state.viewKey === '全部') {
        return state.list
      }
      if (state.viewKey === '未完成') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === '已完成') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    setInputValue(state, val) {
      state.inputValue = val
    },
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    removeItem(state, id) {
      const i = state.list.findIndex(x => x.id === id)
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    changeStatus(state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    changeStatusAll(state) {
      state.list.forEach(row => {
        row.done = true
      });
    },
    cleanStatusAll(state) {
      state.list.forEach(row => {
        row.done = false
      })
    },
    cleanDone(state) {
      state.list = state.list.filter(x => x.done === false)
    },
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      if (sessionStorage.length == 0) {
        Axios.get('./list.json').then(({ data }) => {
          context.commit('initList', data)
        })
      } else {
        context.commit('initList', JSON.parse(sessionStorage.getItem('data')))
      }
    },
    saveList() {
      sessionStorage.setItem("data", JSON.stringify(this.state.list))
    }
  },
  modules: {
  }
})
