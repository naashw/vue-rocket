<template>
  <div class="full-size-page centered">
    <div class="w-[80vw] h-[80vh]" v-if="virtualTour">
      <t-viewer
      :virtualTour
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VirtualTour } from '~/types/virtualTour.type';
import { getFullPath } from '~/composables/picture.composable';


const route = useRoute();
const virtualTourId = route.params.id as string;

const virtualTour: VirtualTour = await fetchVirtualTourById(virtualTourId);
const virtualTourRooms = virtualTour.virtualTourRoom;
</script>

<style scoped>
.full-size-viewer {
  width: 90%;
  height: 80%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
}

.full-size-page {
  width: 99vw;
  height: 93vh;
}
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
