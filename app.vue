<template>
  <NuxtLayout>
    <div class="grid grid-flow-col grid-cols-5 h-screen z-10 w-screen">
      <article class="col-span-1 bg-bg0_h h-full text-fg p-4 flex flex-col items-center prose">
        <span class="uppercase text-3xl">Instructions</span>
        <ol>
          <li>Use the multimeter probes to determine the voltage at each of the wires in the bomb</li>
          <li>Switch to your claws and cut the wire that's high!</li>
          <li>If you cut the wires in the correct order before the time runs out, you win!</li>
        </ol>
      </article>
      <Webcam class="col-span-3"/>
      <div class="flex flex-col items-center justify-center -translate-x-4">

        <DeviceHandler class="col-span-1"/> 
      </div>
    </div>
  </NuxtLayout>
</template>
