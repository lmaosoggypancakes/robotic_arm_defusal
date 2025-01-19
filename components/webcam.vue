<script setup lang="ts">
import { useUserMedia } from "@vueuse/core";
import { reactive, ref, watchEffect } from "vue";

const currentCamera = ref<string>();
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId;
  },
});

const video = ref<HTMLVideoElement>();
const { stream, enabled } = useUserMedia({
  constraints: reactive({ video: { deviceId: currentCamera } }),
});

watchEffect(() => {
  if (video.value) video.value.srcObject = stream.value!;
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 text-center p-4 bg-white text-aqua"
  >
    <div class="p-4 border-2 border-aqua rounded-md">
      <video
        ref="video"
        muted
        autoplay
        controls
        width="500"
        height="500"
    
      />
      <button
        @click="enabled = !enabled"
        class="px-4 py-2 rounded-sm bg-aqua text-base max-w-sm w-full"
      >
        {{ enabled ? "Stop" : "Start" }}
      </button>
    </div>
  </div>
</template>
