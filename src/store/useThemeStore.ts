import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref("light");

  watch(theme, (newVal, oldVal) => {
    document.querySelector("html")?.classList.remove(oldVal);
    document.querySelector("html")?.classList.add(newVal);
  });

  return { theme };
});
