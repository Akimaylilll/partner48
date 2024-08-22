<template>
  <div style="width: 100%;display:flex;align-items: center;justify-content: center;">
    <span style="margin-right: 10px;">主题：</span>
    <el-radio-group v-model="theme" size="large">
      <el-radio-button label="light">浅色</el-radio-button>
      <el-radio-button label="dark">深色</el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.box {
  display: flex;
  justify-content: space-evenly; /* 水平均匀分布 */
  align-items: center; /* 垂直居中 */
  flex-direction: column;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { ElRadioGroup, ElRadioButton } from 'element-plus';
import { useThemeStore } from '../store/useThemeStore.ts';

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

</script>