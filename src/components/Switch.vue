<script setup lang="ts">
import { ref, watch } from "vue";
import { useDPlayerStore } from "../store/useDPlayerStore";
import { storeToRefs } from "pinia";
import { ipcRenderer } from "electron";
const dPlayerStore = useDPlayerStore();
const { isOnTop, videoId } = storeToRefs(dPlayerStore);
function checkboxOnclick() {
  isOnTop.value = !isOnTop.value;
}
watch(isOnTop, (newVal) => {
  ipcRenderer.send("win-on-top", videoId.value, newVal);
});
</script>
<template>
  <div
    class="dplayer-setting-item dplayer-setting-ontop"
    @click="checkboxOnclick()"
  >
    <span class="dplayer-label">置顶</span>
    <div class="dplayer-toggle">
      <input
        id="ontop"
        class="dplayer-ontop-setting-input"
        type="checkbox"
        :checked="isOnTop"
      />
      <label for="dplayer-toggle-ontop"></label>
    </div>
  </div>
</template>
