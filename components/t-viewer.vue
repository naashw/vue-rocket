<template>
    <div class="size-full bg-[primary] p-1 flex" v-if="projectionIsReady">
        <div class="max-h-[100vh] max-w-[250px] overflow-y-auto custom-scrollbar select-none border-r-4 border-red">
            <div class="flex flex-col p-[1rem] gap-[1rem] rounded-md snap-x">
                <div
                    v-for="(room) in virtualTour.virtualTourRoom"
                    class="snap-center"
                >
                    <div
                        @click="setVirtualTourRoom(room)"
                        class="cursor-pointer border-2 border-transparent hover:border-blue-500 hover:border-2"
                    >
                        <img
                            class="h-[150px] object-cover rounded-md"
                            :src="getFullPath(room.pictures[0].filePath)"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="w-[70%] h-[70%] m-auto select-none">
            <View360
                class="w-full h-full rounded-md select-none"
                ref="viewer"
                :debug="true"
                :projection="projection"
                :on-view-change="onViewChange"
                :on-input-start="onMouseDown"
                :on-input-end="onMouseUp"
                :hotspot="{ zoom: true }"
                :fov="110"
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
                            Hi noob peasant
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
    positions: VirtualRoomAnimationPosition[];
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

interface VirtualRoomAnimationPosition {
    id: string;
    time: Date;
    virtualTourRoomId: string;
    pitch: number;
    yaw: number;
    zoom: number;
}
const router = useRouter();

const virtualTourRoomPositionsRef = ref<VirtualTourRoomPosition[]>([]);
const virtualRoomAnimationPositionRef = ref<VirtualRoomAnimationPosition[]>([]);
const virtualTourAnimationIndex = ref(0);
const virtualTourRoom = ref<VirtualTourRoom>();
const virtualTourRoomIndex = ref<number>(0);

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

onMounted(async () => {
    await startVirtualTour(props.virtualTour);
});

// function setFocus(virtualTourRoomToSetup: VirtualTourRoom, index: number) {
//     if (virtualTourRoomIndex.value !== index) {
//         setVirtualTourRoom(virtualTourRoomToSetup);
//         virtualTourRoomIndex.value = index;
//     };
// }

async function sendVirtualTourRoomPositions() {
    const virtualTourId = props.virtualTour.virtualTourId;
    const virtualTourRoomId = virtualTourRoom.value?.id;
    if (!virtualTourRoomPositionsRef.value.length || !virtualTourRoomId) {
        return;
    }

    try {
        await saveVirtualTourRoomPositions(
            virtualTourRoomPositionsRef.value,
            virtualTourId,
        );
        console.log(`Données envoyées avec succès ${virtualTourId}`);
        virtualTourRoomPositionsRef.value = []; // a rendre plus resilient pour eviter la suppression de données pas encore envoyé
    } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
    }
}

async function startVirtualTour(virtualTour: VirtualTour) {
    try {
        await setUpVirtualTour(virtualTour);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        router.push(`/`);
    }

    startAnimationVirtualTour();
    startUpVirtualTourZoom();
    setupVirtualTourDataAutomatic();
}

async function setVirtualTourRoom(virtualTourRoomToSetup: VirtualTourRoom) {
    console.log("set new virtual tour room");
    const filepath = virtualTourRoomToSetup.pictures[0].filePath;
    const fullPath = getFullPath(filepath);
    virtualTourRoom.value = virtualTourRoomToSetup;
    virtualTourRoomPositionsRef
    console.log("Set virtual tour room", fullPath);
    projection.value = new EquirectProjection({
        src: fullPath,
    });
    startUpVirtualTourZoom();
    //    projection = getFullPath(virtualTourRoom.pictures[0].filePath)
}

async function setUpVirtualTour(virtualTour: VirtualTour): Promise<void> {
    const firstRoom = virtualTour?.virtualTourRoom[0];
    const firstPicture = firstRoom?.pictures[0];
    if (!firstRoom || !firstPicture) {
        throw new Error("No room or picture found");
    }
    const picsFullPath = "http://localhost:3001" + firstPicture.filePath;
    virtualTourRoom.value = firstRoom;
    projection = ref(
        new EquirectProjection({
            src: picsFullPath,
        }),
    );

    console.log(projection);

    // wait 500ms
    console.log("Projection is ready");
    projectionIsReady.value = true;
    return await new Promise((resolve) => setTimeout(resolve, 500));
}

function setupVirtualTourDataAutomatic() {
    console.log(viewer.value);
    viewer.value.on("inputStart", onMouseDown);
    viewer.value.on("inputEnd", onMouseUp);
    viewer.value.on("viewChange", onViewChange);
    const sendingInterval = setInterval(sendVirtualTourRoomPositions, 2000);
    onUnmounted(() => {
        clearInterval(sendingInterval);
    });
}

async function startUpVirtualTourZoom() {
    viewer.value.camera.animateTo({
        yaw: 0,
        pitch: 0,
        zoom: 0.6,
        duration: 1000,
        easing: animationPersonnaliser,
    });
}

function startAnimationVirtualTour() {
    setTimeout(() => {
        setInterval(AnimateVirtualTour, timeAnimation / speedAnimation);
    }, 1);
}

async function AnimateVirtualTour() {
    if (clientInteraction.value || virtualRoomAnimationPositionRef.value.length === 0) return;
    if (virtualTourAnimationIndex.value >= virtualRoomAnimationPositionRef.value.length) return;
    const nextView: VirtualRoomAnimationPosition =
        virtualRoomAnimationPositionRef.value[virtualTourAnimationIndex.value];
    viewer.value.view360.camera.animateTo({
        yaw: nextView.yaw,
        pitch: nextView.pitch,
        zoom: nextView.zoom,
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
    animationStartTimeoutId = setTimeout(() => {
        clientInteraction.value = false;
    }, 5000);
}

function onViewChange(evt: ViewChangeEvent) {
    const virtualTourRoomId = virtualTourRoom.value?.id;
    if (!clientInteraction.value || !virtualTourRoomId) return;
    const time = new Date();
    const virtualToorRoomPosition: VirtualTourRoomPosition = {
        time,
        virtualTourRoomId,
        yaw: evt.yaw,
        pitch: evt.pitch,
        zoom: evt.zoom,
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
