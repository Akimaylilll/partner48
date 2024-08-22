<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from "pinia";
import { useMemberLiveListStore } from '../store/useMemberLiveListStore';

const memberLiveListStore = useMemberLiveListStore();
const { sidebarShow } = storeToRefs(memberLiveListStore);
const router = useRouter();
const mainShow = ref(true);
const isActive = (route: string) => {
  const currentRoute = router.currentRoute;
  return currentRoute.value.path === route;
}

const clickArrow = () => {
  sidebarShow.value = !sidebarShow.value;
}
// 创建一个动态查询参数以确保路由变化
// 创建一个动态查询参数以确保路由变化
const refresh = () => {
  mainShow.value = false;
  setTimeout(() => {
    mainShow.value = true;
  }, 100);
}
</script>
<template>
  <div v-if="sidebarShow" class="sidebar">
    <ul class="nav">
      <!-- <li><router-link to="/favorite" :class="isActive('/favorite') ? 'active' : ''">关注</router-link></li> -->
      <li><router-link @click.native="refresh('/allMember')" to="/allMember" :class="isActive('/allMember') ? 'active' : ''">直播</router-link></li>
      <li><router-link to="/settings" :class="isActive('/settings') ? 'active' : ''" >设置</router-link></li>
    </ul>
    <div class="arrow-left" @click="clickArrow"><i class="left"></i></div>
  </div>
  <div v-if="!sidebarShow" style="width: 10px;">
    <div class="arrow-right" @click="clickArrow"><i class="right"></i></div>
  </div>
  <div class="main">
    <router-view v-if="mainShow"></router-view>
  </div>
</template>
<style scoped>
.sidebar {
  width: 120px;
  background-color: var(--sidebar-bg-color);
  padding: 20px;
  height: calc(100% - 40px);
  border-radius: 5px 0 0 5px;
}
.arrow-left {
  height: 60px;
  width: 10px;
  display: block;
  position: absolute;
  top: calc(50% - 30px);
  left: 150px;
  cursor: pointer;
  border-radius: 5px 0 0 5px;
}
.arrow-left:hover {
  background-color: var(--theme-color);
}
.left {
  border: solid var(--sidebar-color);
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  position: absolute;
  top: calc(50% - 6.375px);
  left: 3px;
}

.arrow-right {
  height: 60px;
  width: 10px;
  display: block;
  position: absolute;
  top: calc(50% - 30px);
  left: 0px;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
}
.arrow-right:hover {
  background-color: var(--theme-color);
}
.right {
  border: solid var(--sidebar-color);
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  position: absolute;
  top: calc(50% - 6.375px);
  left: -2px;
}

.nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav li {
  margin-bottom: 10px;
}


.nav li a {
  text-decoration: none;
  display: block;
  padding: 8px;
  border-radius: 4px;
  color: var(--sidebar-color);
}

.nav li a:hover {
  color: #fff !important;
  background-color: #9F88FF;
}
.active {
  color: #9F88FF !important;
}
.main {
  flex-grow: 1;
  margin-left: 8px;
  /* padding: 20px; */
  text-align: center;
  overflow-y: hidden;
}
</style>
