<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter();
const isActive = (route: string) => {
  const currentRoute = router.currentRoute;
  return currentRoute.value.path === route;
}

</script>
<template>
  <div class="sidebar">
    <ul class="nav">
      <li><router-link to="/memberLiveList" :class="isActive('/memberLiveList') ? 'active' : ''">关注</router-link></li>
      <li><router-link to="/keyInput" :class="isActive('/keyInput') ? 'active' : ''" >直播</router-link></li>
    </ul>
  </div>
  <div class="main">
    <router-view></router-view>
  </div>
</template>
<style scoped>
.sidebar {
  width: 120px;
  background-color: #f2f2f2;
  padding: 20px;
  height: calc(100% - 40px);
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
  overflow-y: auto;
}
</style>
