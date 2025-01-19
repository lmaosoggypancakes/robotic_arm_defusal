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
      {{ bothReady ? "Arms Ready!" : "Add Arm" }}
    </button>
    <button
      class="rounded-md max-w-sm w-full place-self-center p-2 disabled:cursor-not-allowed"
      :disabled="serialConnected"
      @click="connectSerial()"
      :class="serialConnected ? 'grayscale' : 'bg-fg text-base'"
    >
      {{ serialConnected ? "Serial Connected!" : "Connect Serial" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { assert, useBluetooth } from "@vueuse/core";
// const bt1 =
//   useBluetooth({
//     optionalServices: ["c3fbf773-8053-480c-8739-765a4c4ddf16", "Arm1"],
//     filters: [
//       {namePrefix: "Arm1"}
//     ],
//   });

// const bt2 = useBluetooth({
//   acceptAllDevices: true,
// });

const serialConnected = ref(false);
const primaryConnected = ref(false);
const secondaryConnected = ref(false);

const arm1Lock = ref(false);
const arm2Lock = ref(false);

const vr = ref([90, 90, 90, 90, 90, 90, 90, 90]);
const arm1Characteristic = ref<any>(undefined);
const arm2Characteristic = ref<any>(undefined);

const serialPort = ref(null);

const connectSerial = async () => {
  // navigator.serial
  //   .requestPort()
  //   .then(async (port) => {
  //     console.log(port);
  //     serialPort.value = port;
  //     await port.open({ baudRate: 9600 });
  //     serialConnected.value = true;
  //     scanForData();
  //   })
  //   .catch((e) => {
  //     console.log("no port");
  //   });
  try {
    const joystick = await navigator.bluetooth.requestDevice({
      optionalServices: ["23ecfd2a-6680-4a89-bc71-d1da5102bc1d"],
      filters: [{ namePrefix: "Joystick" }],
    });
    const server = await joystick.gatt?.connect();
    const service = await server?.getPrimaryService(
      "23ecfd2a-6680-4a89-bc71-d1da5102bc1d"
    );
    const vrRightCharacteristic = await service?.getCharacteristic(
      "23b1f6de-b688-4828-ba10-84f6bac16cd6"
    );
    const vrLeftCharacteristic = await service?.getCharacteristic(
      "e516c4d7-85d3-430e-80da-31c79016db84"
    );

    vrRightCharacteristic?.startNotifications().then(() => {
      vrRightCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        async (event: Event) => {
          const dv = event.target.value;
          if (arm1Characteristic.value && !arm1Lock.value) {
            arm1Lock.value = true;
            await arm1Characteristic.value.writeValue(dv);
            arm1Lock.value = false;
          }
        }
      );
    });

    vrLeftCharacteristic?.startNotifications().then(() => {
      vrLeftCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        async (event: Event) => {
          const dv = event.target.value;
          console.log(dv);
          // console.log(
          //   dv.getUint8(0, true),
          //   dv.getUint8(8, true),
          //   dv.getUint8(16, true),
          //   dv.getUint8(24, true)
          // );
          if (arm2Characteristic.value && !arm2Lock.value) {
            arm2Lock.value = true;
            await arm2Characteristic.value.writeValue(dv);
            arm2Lock.value = false;
          }
        }
      );
    });
  } catch (e) {
    console.error(e);
  }
};
const bothReady = computed(
  () => primaryConnected.value && secondaryConnected.value
);

const scanForData = async () => {
  if (!serialConnected || !serialPort.value) return;
  while (serialPort.value.readable) {
    const reader = serialPort.value.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          break;
        }
        console.log(value);
        // Do something with |value|…
      }
    } catch (error) {
      // Handle |error|…
    } finally {
      reader.releaseLock();
    }
  }
};

const addDevice = async () => {
  if (!primaryConnected.value) {
    try {
      const arm1 = await navigator.bluetooth.requestDevice({
        optionalServices: ["c3fbf773-8053-480c-8739-765a4c4ddf16"],
        filters: [{ namePrefix: "Arm1" }],
      });
      const server = await arm1.gatt?.connect();
      const service = await server?.getPrimaryService(
        "c3fbf773-8053-480c-8739-765a4c4ddf16"
      );
      const characteristic = await service?.getCharacteristic(
        "beffb7fc-daed-4661-b58e-096efdb8d3f4"
      );
      arm1Characteristic.value = characteristic;
      primaryConnected.value = true;
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      const arm2 = await navigator.bluetooth.requestDevice({
        optionalServices: ["ee8a9d57-c260-47f5-bce5-ffe955db3c75"],
        filters: [{ namePrefix: "Arm2" }],
      });
      const server = await arm2.gatt?.connect();
      const service = await server?.getPrimaryService(
        "ee8a9d57-c260-47f5-bce5-ffe955db3c75"
      );
      const characteristic = await service?.getCharacteristic(
        "79e3d073-e733-46bf-a8fe-74f0fffeebbf"
      );
      arm2Characteristic.value = characteristic;
      secondaryConnected.value = true;
    } catch (e) {
      console.error(e);
    }
  }
};
</script>
