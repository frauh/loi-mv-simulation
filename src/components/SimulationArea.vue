<template>
  <div class="area">
    <div id="container" ref="container" class="container"></div>
    <h3 class="heading-left">{{ title }}</h3>
  </div>
</template>

<script>
import Konva from "konva";

export default {
  name: "SimulationArea",
  props: {
    title: String,
    vehicleLayer: Konva.Layer,
  },
  mounted() {
    let stage = new Konva.Stage({
      container: "container",
      width: this.$refs.container.clientWidth,
      height: this.$refs.container.clientHeight,
    });
    stage.add(this.vehicleLayer);
  },
};
</script>

<style scoped>
.heading-left {
  position: absolute;
  color: steelblue;
  background: white;
  top: -9px;
  left: 40px;
}

.area {
  overflow: hidden;
  margin: auto;
  height: 100%;
  /* Seitenverhältnis DIN-A-Blätter */
  aspect-ratio: 1.414;
  background: white;
  border: 5px solid steelblue;
  border-radius: 15px;
}

.container {
  width: 100%;
  height: 100%;
}
</style>