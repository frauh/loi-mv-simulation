<template>
  <div class="container">
    <div class="list">
      <!-- TODO canvas-->
      <div class="img-container" v-for="vehicle in vehicles" :key="vehicle.id">
        <img :style="calculatePosition(vehicle)" :alt="`${vehicle.color}`" :src="require(`@/assets/top-${vehicle.color}.png`)">
      </div>
    </div>
    <h3 class="heading-left">{{ title }}</h3>
  </div>
</template>

<script>
export default {
  name: "SimulationArea",
  props: {
    title: String,
    vehicles: Array
  },
  methods: {
    calculatePosition() {
      return ""
    },
    //TODO umschalter zum Terminieren oder Weiterlaufen der Sim beim Erreichen des Randes?
  }
}
</script>

<style scoped>
.heading-left {
  position: absolute;
  color: steelblue;
  background: white;
  top: -9px;
  left: 40px;
}

.container {
  overflow: hidden;
  margin: auto;
  height: 100%;
  aspect-ratio: 1.414;
  background: white;
  border: 5px solid steelblue;
  border-radius: 15px;
}

.img-container {
  position: relative;
  /* Verhältnis zum DinA0-Blatt*/
  width: 20.6%;
  /*height: 19.38%;*/
}

.img-container img {
  display: block;
  width: 100%;
  height: auto;
}
</style>