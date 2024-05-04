<template>
    <div class="size-full bg-black p-1" v-if="projectionIsReady">
        <View360
            class="w-full h-full"
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
                        It doesn't matter what content you put inside the hotspot or what
                        size you have.
                    </div>
                    <!-- <img src="SOME_IMG_URL" alt="Of course, you can display images." /> -->
                </div>
            </div>
            <div class="flex h-full w-full items-end">
                <div class="collapse">
                    <input type="checkbox" />
                    <div class="collapse-title text-xl font-medium w-full text-white">
                        Click me to show/hide content
                    </div>
                    <div class="flex w-full collapse-content">
                        <div
                            v-for="room in virtualTour.virtualTourRoom"
                            class="relative p-2 bg-black"
                        >
                            <div
                                class="h-full w-full bg-black"
                                @click="setVirtualTourRoom(room)"
                            >
                                <img
                                    :src="getFullPath(room.pictures[0].filePath)"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </View360>
    </div>
</template>
<script setup lang="ts">
import { View360, EquirectProjection, ViewChangeEvent } from "@egjs/vue3-view360";
import { saveVirtualTourRoomPositions } from "../composables/apiVirtualTour.composable";
import { VirtualTourRoomPosition } from "../types/virtualTour.type";

interface VirtualTour {
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    id: string;
    virtualTourId: string;
    virtualTourRoom: VirtualTourRoom[];
}

interface VirtualTourRoom {
    virtualTourId: string;
    id: string;
    name: string;
    pictures: VirtualTourPicture[];
    positions: VirtualTourAnimationDataItem[];
}

interface VirtualTourPicture {
    id: string;
    virtualTourRoomId: string;
    filePath: string;
    filename: string;
}

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

const virtualTourRoomPositionsRef = ref<VirtualTourRoomPosition[]>([]);
const virtualTourAutomaticData = ref<VirtualTourAnimationDataItem[]>([]);
const virtualTourAnimationIndex = ref(0);
const clientInteraction = ref(false);
const speedAnimation = 5;
const timeAnimation = 5000;
let animationStartTimeoutId: ReturnType<typeof setTimeout>;

const projectionIsReady = ref(false);
let projection: Ref<EquirectProjection>;

const viewer = ref(View360);

const props = defineProps<{
    virtualTour: VirtualTour;
}>();

const router = useRouter();

onMounted(async () => {
    await startVirtualTour(props.virtualTour);
});

async function sendVirtualTourRoomPositions() {
    if (!virtualTourRoomPositionsRef.value.length) {
        return;
    }

    try {
        await saveVirtualTourRoomPositions(virtualTourRoomPositionsRef.value);
        console.log("Données envoyées avec succès");
        virtualTourRoomPositionsRef.value = []; // a rendre plus resilient pour eviter la suppression de données pas encore envoyé
    } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
    }
}

async function startVirtualTour(virtualTour: VirtualTour) {
    try {
        await setUpVirtualTour(virtualTour);
        startAnimationVirtualTour();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        router.push(`/`);
    }
}

async function setVirtualTourRoom(virtualTourRoom: VirtualTourRoom) {
    const firstpics = virtualTourRoom?.pictures[0]?.filePath;
    console.log("Set virtual tour room", firstpics);
    const picsFullPath = "http://localhost:3001" + firstpics;
    projection.value = new EquirectProjection({
        src: picsFullPath,
    });

    //    projection = getFullPath(virtualTourRoom.pictures[0].filePath)
}

async function setUpVirtualTour(virtualTour: VirtualTour) {
    console.dir(virtualTour.virtualTourRoom);
    const firstpics = virtualTour?.virtualTourRoom[0]?.pictures[0]?.filePath;
    console.dir(virtualTour.virtualTourRoom);
    console.log("First picture: ", firstpics);
    const picsFullPath = "http://localhost:3001" + firstpics;
    console.log("First picture full path: ", picsFullPath);
    projection = ref(
        new EquirectProjection({
            src: picsFullPath,
        }),
    );

    console.log(projection);

    //wait 2 sec
    console.log("Projection is ready");
    projectionIsReady.value = true;
    // viewer.view360.on("viewChange", onViewChange);
    // viewer.view360.on("inputStart", onMouseDown);
    // viewer.view360.on("inputEnd", onMouseUp);
    // const sendingInterval = setInterval(sendData, 1000);
    // onUnmounted(() => {
    //     clearInterval(sendingInterval);
    // });
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
    const time = new Date();
    const virtualTourRoomId = props.virtualTour.id;
    const position = {
        yaw: evt.yaw,
        pitch: evt.pitch,
        zoom: evt.zoom,
    };
    const virtualToorRoomPosition: VirtualTourRoomPosition = {
        time,
        virtualTourRoomId,
        position,
    };
    StockPosition(virtualToorRoomPosition);
}

function StockPosition(virtualToorRoomPosition: VirtualTourRoomPosition): void {
    virtualTourRoomPositionsRef.value.push(virtualToorRoomPosition);
}
</script>

<style scoped>
.full-size {
    width: 100%;
    height: 100%;
}
</style>
