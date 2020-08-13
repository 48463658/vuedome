<!--
 * @Author: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditTime: 2020-03-24 17:37:38
 * @LastEditors: Gordon
 * @FilePath: \lanplus\src\App.vue
 -->
<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      configlist: null
    }
  },
  created () {
    // this.configlist = JSON.stringify(config)
    // sessionStorage.setItem('configlist', this.configlist)
  }

}
</script>

<style lang="less" scoped>
#app {
  font-size: 16px;
}
</style>
