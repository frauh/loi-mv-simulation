<template>
  <div class="row">
    <div class="col-left">
      <SimulationArea :vehicles="vehicles" title="Simulation"/>
    </div>
    <div class="col-middle">
      <ButtonBar/>
    </div>
    <div class="col-right">
      <VehicleList :vehicles="vehicles"
                   title="Fahrzeuge"
                   @addVehicle="addVehicle"
                   @deleteVehicle="deleteVehicle"
                   @toggleTracking="toggleTracking"/>
      <LogArea title="LCD-Log"/>
    </div>
  </div>
  <!-- https://www.youtube.com/watch?v=qZXt1Aom3Cs -->
</template>

<script>
import SimulationArea from "@/components/SimulationArea.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import VehicleList from "@/components/VehicleList.vue";
import LogArea from "@/components/LogArea.vue";

export default {
  name: "App",
  components: {
    LogArea,
    SimulationArea,
    ButtonBar,
    VehicleList,
    // HeaderComponent,
    // TaskList,
    // AddTask
  },
  data() {
    return {
      vehicles: []
      // tasks: [],
      // showAddTask: false
    }
  },
  methods: {
    addVehicle(vehicle) {
      this.vehicles = [...this.vehicles, vehicle]
    },
    deleteVehicle(id) {
      this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== id)
    },
    toggleTracking(id) {
      this.vehicles = this.vehicles.map((vehicle) => vehicle.id === id ? {...vehicle, isTracked: !vehicle.isTracked} : vehicle)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.vm-titlebar, .vm-content {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

.row::after {
  content: "";
  clear: both;
  display: table;
}

[class*="col-"] {
  float: left;
  padding: 15px;
}

.col-left { /* 8/12 */
  width: 66.66%;
}

.col-middle { /* 1/12 */
  width: 8.33%;
}

.col-right { /* 3/12 */
  width: 25%;
  height: 98vh;
  display: flex;
  flex-direction: column;
}
</style>