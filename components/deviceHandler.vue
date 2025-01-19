<template>
  <div class="bg-bg1 p-4 rounded-md text-fg gap-4 flex flex-col w-full">
    <div class="grid grid-cols-2 gap-4 w-full h-32">
      <div
        class="bg-bg0_h rounded-md flex flex-col justify-center items-center group"
        :class="primaryConnected && 'border-2 border-yellow'"
      >
        <RobotArm
          :class="
            primaryConnected
              ? 'stroke-yellow opacity-100 grayscale-0 group-hover:blur-md transition-all'
              : 'stroke-fg opacity-15 grayscale'
          "
          class="z-0"
        />
        <CloseIcon
          class="absolute hidden group-hover:block z-10 place-self-center hover:stroke-fg"
          @click="primaryConnected = false"
          v-if="primaryConnected"
        />
      </div>
      <div
        class="bg-bg0_h rounded-md flex flex-col justify-center items-center group"
        :class="secondaryConnected && 'border-2 border-blue'"
      >
        <CloseIcon
          class="absolute hidden group-hover:block z-10 place-self-center hover:stroke-fg"
          @click="secondaryConnected = false"
          v-if="secondaryConnected"
        />
        <RobotArm
          :class="
            secondaryConnected
              ? 'stroke-blue opacity-100 grayscale-0 group-hover:blur-md'
              : 'stroke-fg opacity-15 grayscale'
          "
          class="scale-x-[-1]"
        />
      </div>
    </div>
    <button
      class="rounded-md max-w-sm w-full place-self-center p-2 disabled:cursor-not-allowed"
      :disabled="bothReady"
      @click="addDevice()"
      :class="bothReady ? 'grayscale' : 'bg-fg text-base'"
    >
      {{ bothReady ? "Ready!" : "Add Device" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useBluetooth } from "@vueuse/core";
const { isSupported, isConnected, device, requestDevice, server } =
  useBluetooth({
    acceptAllDevices: true,
  });
const primaryConnected = ref(false);
const secondaryConnected = ref(false);
const bothReady = computed(
  () => primaryConnected.value && secondaryConnected.value
);
const addDevice = () => {
  if (!primaryConnected.value) {
    primaryConnected.value = true;
  } else {
    secondaryConnected.value = true;
  }
  console.log("requesting"          );
  requestDevice();
};
</script>
