<template>
    <div v-if="keyRecoveringStatus === keyState.SUCCESS">
        <file-uploader :virtualTourId="virtualTourId"></file-uploader>
    </div>
    <div v-else-if="keyRecoveringStatus === keyState.LOADING">
        <p>Chargement... de l'identifiant unique pour la visite virtuelle</p>
    </div>
    <div v-else-if="keyRecoveringStatus === keyState.ERROR">
        <p>
            Erreur lors de la récupération de l'identifiant unique pour la visite
            virtuelle veuillez re-essayer
        </p>
    </div>
</template>

<script setup lang="ts">
import { RandomId } from "~/types/randomId.type";
// vuejs on mounted get data from api
import { onBeforeMount } from "vue";
import { isVirtualTourIdValide } from "~/validators/virtualTourId.validator";
import { getRandomVirtualTourId } from "~/composables/getRandomId.composable";

const virtualTourId = ref<RandomId>({ key: "", checksum: "" });
const keyState = Object.freeze({
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
});
const keyRecoveringStatus = ref<string>(keyState.LOADING);

onBeforeMount(async () => {
    try {
        const randomId = await getRandomVirtualTourId();
        const validateRandomId = isVirtualTourIdValide(randomId);
        if (!validateRandomId) {
            throw new Error(
                `Erreur lors de la validation de l'id unique, ${randomId} n'est pas valide`,
            );
        }
        virtualTourId.value = randomId;
        keyRecoveringStatus.value = keyState.SUCCESS;
        ("");
    } catch (error) {
        console.error(error);
        keyRecoveringStatus.value = keyState.ERROR;
    }
});
</script>
