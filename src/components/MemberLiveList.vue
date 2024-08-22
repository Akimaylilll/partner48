<script setup lang="ts">
import { toRefs, watch, reactive, onMounted, ref, nextTick, setInterval } from 'vue';
import { useStorage } from '@vueuse/core';
import { useMemberLiveListStore } from '../store/useMemberLiveListStore';
import { debounce } from "lodash";
import MemberCard from "../components/MemberCard.vue";
import { storeToRefs } from "pinia";
import { ElInput } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { getCurrentInstance } from "vue";
import SearchInput from "../components/SearchInput.vue";


const memberLiveListStore = useMemberLiveListStore();
const { reSetReplayDict, initPage, initMessage, getMemberList, initMemberList } = memberLiveListStore;
const { liveList, replayList, next, isQueryLive, showTopLoading, showBottomLoading, searchArr, sidebarShow } = storeToRefs(memberLiveListStore);

const renderComponent = ref(true);
const replayDict = ref<any>({});
const searchLiveList = ref<any[]>([]);
const searchReplayList = ref<any[]>([]);
const cursor = ref('pointer');
const screenWidth = ref(0)
const itemWidth = ref(0);
const isQueryList = ref(false);
let timer: null | number = null;

onMounted(async () => {
  initMessage();
  await initMemberList();
  screenWidth.value = window.innerWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    })()
  }
  const ob = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) {
      timer && clearTimeout(timer);
      return;
    }
    timer = window.setInterval(async () => {
      isQueryList.value = true;
      if(isQueryList.value) {
        await getMemberList();
      }
      isQueryList.value = true;
    }, 2000);
  }, {
    root: null,
    threshold: 0,
  });

  ob.observe(document.querySelector('.loading'));
});

watch(liveList, (newVal: any[]) => {
  console.log(newVal);
  if(searchArr.value.length < 1) {
    searchLiveList.value = liveList.value;
    return;
  }
  searchLiveList.value = liveList.value.filter((item: any) => {
    return searchArr.value.some(keyword => {
      return item.userInfo.starName.includes(keyword);
    });
  });
});

watch(replayList, (newVal: any[]) => {
  if(searchArr.value.length < 1) {
    searchReplayList.value = newVal;
    replayDict.value = reSetReplayDict(searchReplayList.value);
    return;
  }
  searchReplayList.value = newVal.filter((item: any) => {
    return searchArr.value.some(keyword => {
      return item.userInfo.starName.includes(keyword);
    });
  });
  replayDict.value = reSetReplayDict(searchReplayList.value);
});

const calcNewItemWidth = (width: number, left: number) => {
  const defaultItemWidth = 300;
  const defaultItemWidthNum = Math.floor((width - left) / defaultItemWidth);
  const newItemWidth = (width - left - 8 - 65 - (defaultItemWidthNum - 1) * 5) /  defaultItemWidthNum;
  return newItemWidth - 6;
}

watch(screenWidth, (newWidth) => {
  if(sidebarShow.value) {
    itemWidth.value = calcNewItemWidth(newWidth, 120);
  } else {
    itemWidth.value = calcNewItemWidth(newWidth, 10);
  }
});

watch(sidebarShow, (newVal) => {
  renderComponent.value = false;
  if(newVal) {
    itemWidth.value = calcNewItemWidth(screenWidth.value, 120);
  } else {
    itemWidth.value = calcNewItemWidth(screenWidth.value, 10);
  }
  setTimeout(() => {
    nextTick(() => {
      renderComponent.value = true;
    });
  }, 500);
});

watch(searchArr, (newVal) => {
  setTimeout(() => {
    renderComponent.value = false;
    if(newVal.length > 0) {
      searchLiveList.value = liveList.value.filter((item: any) => {
        return searchArr.value.some(keyword => {
          return item.userInfo.starName.includes(keyword);
        });
      });
      searchReplayList.value = replayList.value.filter((item: any) => {
        return searchArr.value.some(keyword => {
          return item.userInfo.starName.includes(keyword);
        });
      });
    } else {
      searchLiveList.value = liveList.value;
      searchReplayList.value = replayList.value;
    }
    replayDict.value = reSetReplayDict(searchReplayList.value);
    nextTick(() => {
      renderComponent.value = true;
    });
  }, 100);
});

</script>

<template>
  <div style="width:100%; height: 100%;margin: 0 auto;">
    <div style="width: 100%">直播</div>
    <div v-masonry gutter="5" :fitWidth="true" :v-if="renderComponent" class="grid">
      <div v-masonry-tile class="grid-item" v-for="(o ,index) in searchLiveList" :key="index">
        <MemberCard v-if="o" :live-info = "o"></MemberCard>
      </div>
    </div>
    <div style="width: 100%">重播</div>
    <div v-if="renderComponent" v-for="dateKey,dateIndex in Object.keys(replayDict)"  :key="dateIndex">
      <div style="width: 100%">{{ dateKey }}</div>
      <div v-masonry gutter="5" :v-if="true">
        <div v-masonry-tile class="grid-item" v-for="(o,index) in replayDict[dateKey]" :key="index">
          <MemberCard :live-info = o></MemberCard>
          <!-- <div style="width:100px; height: 500px;background-color: thistle;padding: 10px;"></div> -->
        </div>
      </div>
    </div>
    <div class="loading">
      <img src="../img/loading.svg" style="width: 100px;">
    </div>
  </div>
</template>

<style scoped>
.grid {
  margin: 0 auto;
}

.grid-item {
  width: v-bind(itemWidth + "px");
  border-radius: 10px;
  border: transparent 3px solid;
  cursor: v-bind(cursor);
  /* margin: 5px 0; */
  background-color: var(--card-bg-color);
  margin-bottom: 5px;
}

.grid-item:hover {
  border-color: #747bff;
  border: #747bff 3px solid;
}

</style>
