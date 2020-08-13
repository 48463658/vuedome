<!--
 * @Author: Gordon
 * @Date: 2020-03-09 16:58:50
 * @LastEditTime: 2020-03-12 20:38:12
 * @LastEditors: Gordon
 * @FilePath: \lanplus\src\components\Mbreadcrumb.vue
 -->
<template>
<div>

  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">
          <router-link v-if="item.url" :to="item.url">{{item.name}}</router-link>
          <a v-else>
              {{item.name}}
          </a>
      </el-breadcrumb-item>
  </el-breadcrumb>

</div>
</template>
<style>
</style>
<script>
export default {
  data() {
    return {}
  }
}
</script>
