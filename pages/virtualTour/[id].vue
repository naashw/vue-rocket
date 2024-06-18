<template>
    <div class=" centered">
        <div class="w-[100vw] h-[100vh]" v-if="virtualTour">
            <t-viewer :virtualTour="virtualTour" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { VirtualTour } from "~/types/virtualTour.type";

const route = useRoute();
const router = useRouter();
const virtualTourId = route.params.id as string;
const virtualTour: VirtualTour = await fetchVirtualTourById(virtualTourId);

    if (!virtualTour) {
        router.push("/");
    }
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
