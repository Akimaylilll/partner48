<template>
  <el-input
    v-model="searchInput"
    @input="search()"
    class="search"
    size="large"
    placeholder="搜索成员"
    :suffix-icon="Search"
  />
</template>

<style scoped>
.search {
  width: 80%;
  height: 38px;
  margin: 10px;
  border: 1px solid #4C4D4F;
  border-radius: 4px;
  display: inline-flex;
}
:deep(.el-input--large) {
  font-size: 14px;
}
:deep(.el-input) {
  position: relative;
  font-size: 14px;
  display: inline-flex;
  width: 100%;
  line-height: 40px;
  box-sizing: border-box;
  vertical-align: middle;
}
:deep(.el-input--large .el-input__wrapper) {
    padding: 1px 15px;
}
:deep(.el-input__wrapper) {
    display: inline-flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    padding: 1px 11px;
    background-color: transparent;
    background-image: none;
    border-radius: 4px;
    cursor: text;
    transition: box-shadow .2s cubic-bezier(.645, .045, .355, 1);
    transform: translateZ(0);
    box-shadow: 0 0 0 1px #4C4D4F inset;
}
:deep(.el-input__suffix-inner) {
    pointer-events: all;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 38px;
}
:deep(.el-input__suffix-inner .icon) {
  height: 20px;
  width: 20px;
}
:deep(.el-input .el-input__icon) {
    height: inherit;
    line-height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .3s;
    margin-left: 8px;
}
:deep(.el-input__suffix-inner>:first-child) {
    margin-left: 8px;
}
:deep(.el-icon) {
    height: 1em;
    width: 1em;
    line-height: 1em;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    fill: currentColor;
    color: inherit;
    font-size: inherit;
}
:deep(.el-input__inner) {
  border: none;
  background-color: transparent;
  width: calc(100% - 36px);
  outline: none;
  margin-left: 5px;
  color: var(--v-color);
}
</style>

<script setup lang="ts">
import { toRefs, watch, reactive, onMounted, ref, nextTick, setInterval } from 'vue';
import { ElInput } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { storeToRefs } from "pinia";
import { useMemberLiveListStore } from '../store/useMemberLiveListStore';
import { debounce } from "lodash";

const memberLiveListStore = useMemberLiveListStore();
const { searchArr, searchInput } = storeToRefs(memberLiveListStore);
const search = debounce(() => {
  searchArr.value = [];
  searchArr.value.push(searchInput.value);
}, 100);
</script>
