
<template>
  <div style="height:100%;width:100%;overflow-y: auto; overflow-x: hidden;">
    <MemberLiveList></MemberLiveList>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useMemberLiveListStore } from '../store/useMemberLiveListStore';
import MemberLiveList from "../components/MemberLiveList.vue";

const memberLiveListStore = useMemberLiveListStore();
const { searchArr } = storeToRefs(memberLiveListStore);
onMounted(() => {
  searchArr.value = [''];
});
</script>
