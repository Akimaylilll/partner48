<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { openLiveById } from '../renderer/index';
import { debounce } from "lodash";
import { ElCard } from 'element-plus';
import { ipcRenderer } from 'electron';
import { LiveInfo } from '../types/globle';
import { LiveTypeEnum, LiveStatusEnum } from "../enum/globle";

const cursor = ref('pointer');
const isOpenLivePage = ref(false);

const props = defineProps({
  liveInfo: {
    type: Object as () => LiveInfo,
    require: true,
    default: {}
  }
});

const openLive = debounce((liveId: string, username: string) => {
  cursor.value = "wait";
  isOpenLivePage.value = true;
  openLiveById(liveId, username).then((value) => {console.log(value)});
}, 1000, {
  leading: true,
  trailing: false
});

ipcRenderer.on('live-init-success', function (event, args){
  isOpenLivePage.value = false;
  cursor.value = "pointer";
});

const getSourceURL = (path: string) => {
  return `https://source.48.cn${path}`;
}

</script>
<template>
  <el-card @click="!isOpenLivePage&&openLive(liveInfo.liveId, liveInfo.userInfo.nickname)">
      <img :src="getSourceURL(liveInfo.coverPath)" class="cover">
      <div class="content">
        <span class="top-left">{{liveInfo.title.length > 5 ? liveInfo.title.slice(0, 5) + '...' : liveInfo.title}}</span>
        <span :class="{
          'top-right': true,
          ['bg-color-live-status-' + LiveStatusEnum[liveInfo.status].value]: true
        }">{{ LiveStatusEnum[liveInfo.status as keyof typeof LiveStatusEnum].label }}</span>
        <div class="bottom-left">
          <img :src="getSourceURL(liveInfo.userInfo.teamLogo)" class="logo">
          <time class="time"> {{ liveInfo.userInfo.nickname }} </time>
        </div>
        <span :class="{
          'bottom-right': true,
          ['bg-color-live-type-' + LiveTypeEnum[liveInfo.liveType].value]: true
        }">{{ LiveTypeEnum[liveInfo.liveType as keyof typeof LiveTypeEnum].label }}</span>
      </div>
    </el-card>
</template>
<style scoped>
.cover {
  width: 100%;
  border-radius: 8px 8px 0 0;
}
.logo{
  height: 15px;
  padding: 0px;
  vertical-align: middle;
}
.grid-item {
  width: 46%;
  padding-bottom: 10px;
  border-radius: 10px;
  border: transparent 3px solid;
  cursor: v-bind(cursor);
}
.liveType {
  position: absolute;
  bottom: 96px;
  right: 28px;
  padding: 1px 5px 1px 5px;
  border-radius: 5px;
}
.content {
  height: 50px;
  padding: 5px;
  position: relative;
}
.top-left {
  position: absolute;
  top: 5px;
  left: 5px;
}
.top-right {
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 5px;
  padding: 0 5px;
}
.bottom-left {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.bottom-right {
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 5px;
  padding: 0 5px;
}

.bg-color-live-status-live {
  background-color: #33FFDD;
}

.bg-color-live-status-replay {
  background-color: #FF7744;
}

.bg-color-live-type-video {
  background-color: #7744FF;
}
.bg-color-live-type-audio {
  background-color: #FFCC22;
}
.bg-color-live-type-lianmai {
  background-color: yellow;
}
.bg-color-live-type-game {
  background-color: yellow;
}
.bg-color-live-type-luping {
  background-color: #33FFDD;
}
</style>