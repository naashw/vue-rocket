<template>
  <div class="full-size">
    <View360 class="full-size" ref="viewer" :debug="true" :projection="projection" :on-view-change="onViewChange"
      :on-ready="onReady" :hotspot="{ zoom: true }" :fov="80">
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
          <img src="SOME_IMG_URL" alt="Of course, you can display images." />
        </div>
      </div>
    </View360>
  </div>
</template>
<script setup lang="ts">
import { View360, EquirectProjection, ViewChangeEvent } from "@egjs/vue3-view360";
import { DefineComponent } from "nuxt/dist/app/compat/capi";

interface VirtualTourDataItem {
  time: Date;
  virtualTourId: string;
  yaw: number;
  pitch: number;
  zoom: number;
}

const virtualTourData = ref<VirtualTourDataItem[]>([]);
const virtualTourAutomaticData = ref<VirtualTourDataItem[]>([]);
const virtualTourAnimationIndex = ref(0);

const projection = new EquirectProjection({
  src: "/360_mock.jpg",
});

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
    const response = await $fetch('virtualTour/save/', {
      method: 'POST',
      body: dataSliced,
      baseURL: 'http://localhost:3001/',
    });

    console.log('Données envoyées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error);
  }
}

async function fetchData() {
  try {
    const response: any = await $fetch('virtualTour/1/', {
      method: 'GET',
      baseURL: 'http://localhost:3001/',
    });

    virtualTourAutomaticData.value = response;
    startAnimationVirtualTour();
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

function startAnimationVirtualTour() {
  console.log('lookAt');
  console.log(viewer.value.view360.camera);
  viewer.value.view360.camera.animateTo({yax: 270, pitch:270, zoom:1,duration: 2000});
  // viewer.value.view360.zoom = 20;
  // viewer.value.view360.lookAt('90', '90', '90', '1000');
// setInterval(AnimateVirtualTour, 1000);
}

async function AnimateVirtualTour() {
  const nextView: VirtualTourDataItem = virtualTourAutomaticData.value[virtualTourAnimationIndex.value]
  return { yaw: nextView.yaw, pitch: nextView.pitch, fov: 90, delay: 1000 };
  virtualTourAnimationIndex.value++;
}

onMounted(async () => {
  viewer.value.view360.on("viewChange", onViewChange);
  const sendingInterval = setInterval(sendData, 1000);
  await fetchData();
  onUnmounted(() => {
    clearInterval(sendingInterval);
  });

});


function onViewChange(evt: ViewChangeEvent) {
  StockPosition(evt.yaw, evt.pitch, evt.zoom);
};
function onReady() {
  console.log("ready");
};

function StockPosition(yaw: number, pitch: number, zoom: number): void {
  virtualTourData.value.push({
    time: new Date(),
    virtualTourId: '1',
    yaw,
    pitch,
    zoom,
  })
}


</script>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
}
</style>
