<!--
 * @Author: Gordon
 * @Date: 2020-03-09 11:34:06
 * @LastEditTime: 2020-03-27 17:58:53
 * @LastEditors: Gordon
 * @FilePath: \lanplus\src\components\NavMenu.vue
 -->
<template>
  <fragment class="navMenu">
    <template v-for="navMenu in navMenus" class="navMenu">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="!navMenu.childs&&navMenu.entity"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.alias"
        :route="navMenu.entity.value"
        :disabled="navMenu.entity.disabled"
      >
        <i v-if="navMenu.entity.icon" :class="navMenu.entity.icon"></i>
        <span v-else>○ </span>
        <!-- <i :class="navMenu.entity.icon"></i> -->
        <span slot="title">{{navMenu.entity.alias}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu
        v-if="navMenu.childs&&navMenu.entity"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.alias"
        :disabled="navMenu.entity.disabled"
      >
        <template slot="title">
          <i v-if="navMenu.entity.icon" :class="navMenu.entity.icon"></i>
          <span v-else>○ </span>
          <span slot="title">{{navMenu.entity.alias}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </template>
  </fragment>
</template>

<script>
export default {
  name: 'NavMenu',
  props: ['navMenus'],
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
</style>
