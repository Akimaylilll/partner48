
<template>
  <div style="height:100%;width:100%;overflow-y: auto; overflow-x: hidden;">
    <SearchInput></SearchInput>
    <MemberLiveList></MemberLiveList>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from "pinia";
import SearchInput from "../components/SearchInput.vue";
import MemberLiveList from "../components/MemberLiveList.vue";
import { useMemberLiveListStore } from '../store/useMemberLiveListStore';

const memberLiveListStore = useMemberLiveListStore();
const { searchArr } = storeToRefs(memberLiveListStore);
onMounted(() => {
  searchArr.value = [];
});
</script>
