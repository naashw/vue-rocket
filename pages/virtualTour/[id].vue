<template>
  <div class="full-size-page centered">
    <div class="full-size-viewer">
      <t-viewer
      :virtualTourId
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const virtualTourId = route.params.id as string;
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
