<template>
    <div v-if="virtualTourId">
        <file-uploader :virtualTourId="virtualTourId"></file-uploader>
    </div>
</template>

<script setup lang="ts">
// vuejs on mounted get data from api
import { onBeforeMount } from "vue";
const virtualTourId = ref<{ key: string; checksum: string }>({ key: "", checksum: "" });

onBeforeMount(async () => {
    virtualTourId.value = await getRandomVirtualTourId();
});

async function getRandomVirtualTourId(): Promise<{ key: string; checksum: string }> {
    // Envoyez les données à l'API
    try {
        const randomId: { key: string; checksum: string } = await $fetch(
            "virtualTour/id",
            {
                method: "GET",
                baseURL: "http://localhost:3001/",
            },
        );

        console.log("Données récupéré avec succès");
        console.log("randomId : ", randomId);
        return randomId;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'id unique : ", error);
        throw error;
    }
}
</script>
