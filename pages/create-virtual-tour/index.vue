<template>
  <div v-if="virtualTourId">
  <file-uploader :virtualTourId="virtualTourId"></file-uploader>
  </div>
</template>

<script setup lang="ts">

// vuejs on mounted get data from api
import { onMounted, onBeforeMount  } from 'vue';
const virtualTourId = ref<string|undefined>(undefined);

onBeforeMount(async () => {
  virtualTourId.value = await getRandomVirtualTourId();
});

async function getRandomVirtualTourId(): Promise<string | undefined> {
  // Envoyez les données à l'API
  try {
    const randomId: string = await $fetch('virtualTour/id', {
      method: 'GET',
      baseURL: 'http://localhost:3001/',
    });

    console.log('Données récupéré avec succès');
    return randomId;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'id unique : ', error);
  }
}
</script>
