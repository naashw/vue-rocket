<template>
    <div v-if="projectionIsReady">
        <div class="full-size">
            <View360
                class="full-size"
                ref="viewer"
                :debug="true"
                :projection="projection"
                :on-view-change="onViewChange"
                :hotspot="{ zoom: true }"
                :fov="80"
            >
                <div class="view360-hotspots">
                    <!-- Hotspots -->
                    <div class="view360-hotspot" data-yaw="0" data-pitch="0">1</div>
                    <!-- You can use either Yaw(Y-axis rotation), Pitch(X-axis rotation) for hotspot position -->
                    <div class="view360-hotspot" data-yaw="2" data-pitch="0">2</div>
                    <!-- You can also use direct 3D coordinates. -->
                    <div class="view360-hotspot" data-position="0 1 0">3</div>
                    <!-- View 360 only places the hotspot in the appropriate location. -->
                    <!-- You can decorate your hotspots however you want! -->
                    <div class="view360-hotspot" data-yaw="-90" data-pitch="-90">
                        <div>
                            It doesn't matter what content you put inside the hotspot or
                            what size you have.
                        </div>
                        <!-- <img src="SOME_IMG_URL" alt="Of course, you can display images." /> -->
                    </div>
                </div>
            </View360>
        </div>
    </div>
</template>
<script setup lang="ts">
import { View360, EquirectProjection, ViewChangeEvent } from "@egjs/vue3-view360";

interface VirtualTourDataItem {
    time: Date;
    virtualTourRoomId: string;
    yaw: number;
    pitch: number;
    zoom: number;
}

interface VirtualTourAnimationDataItem {
    position: {
        yaw: number;
        pitch: number;
        zoom: number;
    };
}

const virtualTourData = ref<VirtualTourDataItem[]>([]);
const virtualTourAutomaticData = ref<VirtualTourAnimationDataItem[]>([]);
const virtualTourAnimationIndex = ref(0);
const clientInteraction = ref(false);
const speedAnimation = 5;
const timeAnimation = 5000;
let animationStartTimeoutId: ReturnType<typeof setTimeout>;

const projection = new EquirectProjection({
    src: "/360_mock.jpg",
});

const projectionIsReady = ref(false);
const projectionRef = ref<EquirectProjection | null>(null);

const viewer = ref(View360);

async function sendData() {
    // Vérifiez s'il y a des données à envoyer
    if (virtualTourData.value.length <= 0) {
        return;
    }
    const dataSliced = virtualTourData.value.slice(); // Copiez les données à envoyer
    virtualTourData.value = []; // Videz le tableau

    // Envoyez les données à l'API
    try {
        const response = await $fetch("virtualTour/", {
            method: "POST",
            body: dataSliced,
            baseURL: "http://localhost:3001/",
        });

        console.log("Données envoyées avec succès");
    } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
    }
}

async function fetchData() {
    try {
        const virtualTourRoomId = "3ZIekmPFq1gL"; // TODO : Remplacez par l'identifiant de la pièce
        const response: VirtualTourAnimationDataItem[] = await $fetch(
            `virtualTour/id/${virtualTourRoomId}`,
            {
                method: "GET",
                baseURL: "http://localhost:3001/",
            },
        );

        virtualTourAutomaticData.value = response;
        updateVirtualTourData();
        startAnimationVirtualTour();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

async function updateVirtualTourData() {
    projectionRef.value = new EquirectProjection({
        src: "/360_mock.jpg",
    });
    projectionIsReady.value = true;
    console.log("Projection is ready")

    viewer.value.view360.on("viewChange", onViewChange);
    viewer.value.view360.on("inputStart", onMouseDown);
    viewer.value.view360.on("inputEnd", onMouseUp);
    const sendingInterval = setInterval(sendData, 1000);
    onUnmounted(() => {
        clearInterval(sendingInterval);
    });
}

function startAnimationVirtualTour() {
    setTimeout(() => {
        setInterval(AnimateVirtualTour, timeAnimation / speedAnimation);
    }, 1);
}

async function AnimateVirtualTour() {
    if (clientInteraction.value || virtualTourAutomaticData.value.length === 0) return;
    if (virtualTourAnimationIndex.value >= virtualTourAutomaticData.value.length) return;
    const nextView: VirtualTourAnimationDataItem =
        virtualTourAutomaticData.value[virtualTourAnimationIndex.value];
    viewer.value.view360.camera.animateTo({
        yaw: nextView.position.yaw,
        pitch: nextView.position.pitch,
        zoom: nextView.position.zoom,
        duration: timeAnimation / speedAnimation,
        easing: animationPersonnaliser,
    });
    virtualTourAnimationIndex.value++;
}

function animationPersonnaliser(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

onMounted(async () => {
    await fetchData();
});

function onMouseDown() {
    clientInteraction.value = true;
    clearTimeout(animationStartTimeoutId);
}

function onMouseUp() {
    // await 2 seconds before set to false
    animationStartTimeoutId = setTimeout(() => {
        clientInteraction.value = false;
    }, 5000);
}

function onViewChange(evt: ViewChangeEvent) {
    if (!clientInteraction.value) return;
    StockPosition(evt.yaw, evt.pitch, evt.zoom);
}

function StockPosition(yaw: number, pitch: number, zoom: number): void {
    virtualTourData.value.push({
        time: new Date(),
        virtualTourRoomId: "0f76ae11-2453-4ced-a8a0-67c1813c9841", // TODO : Remplacez par l'identifiant de la pièce
        yaw,
        pitch,
        zoom,
    });
}
</script>

<style scoped>
.full-size {
    width: 100%;
    height: 100%;
}
</style>
