<template>
  <div class="bg-base w-screen h-screen overflow-hidden relative flex flex-col just" ref="matrix">
    <div
      class="w-screen h-1 bg-base rotate-[30deg] absolute bottom-0 -translate-x-[200px] overflow-hidden"
    >
      <div class="h-full bg-aqua shadow-2xl" ref="p1"></div>
    </div>
    <div
      class="w-screen h-1 bg-base rotate-[15deg] absolute top-0 translate-x-[500px] overflow-hidden"
    >
      <div class="h-full bg-aqua shadow-2xl" ref="p2"></div>
    </div>
    <div
      class="w-screen h-1 bg-base rotate-[-80deg] absolute overflow-hidden translate-x-[800px] -bottom-[50px]"
    > 
      <div class="h-full bg-aqua shadow-2xl" ref="p3"></div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const progress = ref<number>(0);
const p1 = ref<HTMLElement>();
const p2 = ref<HTMLElement>();
const p3 = ref<HTMLElement>();
const curve = (x: number, offset?: number) =>
  50 * Math.sin(((x - (offset ?? 0)) * Math.PI) / 200) + 50;
onMounted(() => {
  setInterval(() => {
    if (p1.value && p2.value && p3.value) {
      p1.value.style.width = `${curve(progress.value)}%`;
      p2.value.style.width = `${curve(progress.value, 30)}%`;
      p3.value.style.width = `${curve(progress.value, 50)}%`;
    }
    progress.value++;
  }, 25);
});
</script>
