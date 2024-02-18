<script setup lang="ts">
import { toRefs, watch, reactive, onMounted, ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { useMemberLiveListStore } from '../store/useMemberLiveListStore';
import { debounce } from "lodash";
import MemberCard from "../components/MemberCard.vue";
import { storeToRefs } from "pinia";

const memberLiveListStore = useMemberLiveListStore();
const { reSetReplayDict, initPage, handleScroll } = memberLiveListStore;
const { liveList, replayList, next, isQueryLive, showTopLoading, showBottomLoading } = storeToRefs(memberLiveListStore);

const replayDict = ref<any>({});
const cursor = ref('pointer');
const screenWidth = ref(0)
const itemWidth = ref(0);

onMounted(() => {
  screenWidth.value = window.innerWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    })()
  }
  initPage().then(() => {
    showTopLoading.value = false;
    window.addEventListener('scroll', handleScroll, true);
  });
});

watch(showTopLoading, (newVal) => {
  if(newVal) {
    document.body.style.overflowY = 'scroll';
  } else {
    document.body.style.overflowY = 'auto';
  }
});

watch(replayList, (newVal: any[]) => {
  replayDict.value = reSetReplayDict(newVal);
});

watch(screenWidth,
    (newWidth) => {
      // 在这里执行你的逻辑
      console.log('页面宽度变化了', newWidth);
      const newItemWidth = (newWidth - 120) * Number((1 / 3).toFixed(2)) - 30;
      if(newItemWidth < 200) {
        itemWidth.value = 200;
      } else {
        itemWidth.value = newItemWidth;
      }
    }
);

const clickTop = debounce(() => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}, 1000, {
  leading: true,
  trailing: false
});

</script>

<template>
  <div v-if="showTopLoading">
    <img src="../img/loading.svg" style="width: 100px;">
  </div>
  <div @scroll.prevent="debounce(handleScroll, 1000)" style="width:100%; height: 100%;">
    <div style="width: 100%">直播</div>
      <div v-masonry gutter="10" :v-if="true" class="grid">
        <div v-masonry-tile gutter="10" itemSelector=".grid-item" :fitWidth= "true" class="grid-item" v-for="(o ,index) in liveList" :key="index">
          <MemberCard v-if="o" :live-info = "o"></MemberCard>
        </div>
    </div>
    <div style="width: 100%">重播</div>
      <div v-for="dateKey,dateIndex in Object.keys(replayDict)"  :key="dateIndex">
        <!-- <div style="width: 100%">{{ dateKey }}</div> -->
        <div v-masonry item-selector=".grid-item" :v-if="true">
          <div v-masonry-tile :gutter="10" class="grid-item" :fitWidth="true" v-for="(o,index) in replayDict[dateKey]" :key="index">
            <MemberCard :live-info = o></MemberCard>
            <!-- <div style="width:100px; height: 500px;background-color: thistle;padding: 10px;"></div> -->
          </div>
        </div>
      </div>
  </div>
  <div v-if="showBottomLoading" >
    <img src="../img/loading.svg" style="width: 100px;">
  </div>
  <button class="footer" @click="clickTop"></button>
</template>

<style scoped>
.grid {
  width: 100%;
}
.footer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background-image: url("../img/return_top.svg");
  background-position: center;
  color: #fff;
  background-color: #1a1a1a !important;
}
.grid-item {
  width: v-bind(itemWidth + "px");
  border-radius: 10px;
  margin-left: 0px;
  border: transparent 2px solid;
  cursor: v-bind(cursor);
  margin: 5px 0;
}

.grid-item:hover {
  border-color: yellow;
}

</style>
