/*
 * @Description:
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-04-02 21:26:09
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-03 09:27:23
 */

import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex)

const state = {
  comVI: {
    title: '蓝普金睛',
    ico: '',
    logo: ''
  }
}

const mutations = {
  setComVI(state, data) {
    if (data) {
      if (data.title) {
        state.comVI.title = data.title
      }
      if (data.ico) {
        state.comVI.ico = data.ico
      }
      if (data.logo) {
        state.comVI.logo = data.logo
      }
    }
  }
}

// const action = {
//   commitComVI: ({ commit }, comVI) => commit('setComVI', comVI)
// }

export default new vuex.Store({
  state,
  mutations
})
