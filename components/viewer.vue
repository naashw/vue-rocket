<template>
  <div class="full-size">
    <View360
      class="full-size"
      ref="viewer"
      :debug="true"
      :projection="projection"
      :on-view-change="onViewChange"
      :on-ready="onReady"
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
          <img src="SOME_IMG_URL" alt="Of course, you can display images." />
        </div>
      </div>
    </View360>
  </div>
</template>
<script setup lang="ts">
import { View360, EquirectProjection, ViewChangeEvent } from "@egjs/vue3-view360";

const projection = new EquirectProjection({
  src: "/360_mock.jpg",
});

const viewer = ref(View360);

onMounted(() => {
  console.log(viewer.value.view360.on("viewChange", onViewChange));
});

function  onViewChange(evt: ViewChangeEvent) {
  console.log("view change", evt.yaw);
};
function onReady() {
  console.log("ready");
};
</script>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
}
</style>
