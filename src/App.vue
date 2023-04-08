<template>
  <div class="row">
    <div class="col-left">
      <SimulationArea :vehicle-layer="vehicleLayer" title="Simulation" />
    </div>
    <div class="col-middle">
      <ButtonBar
        :is-running="simulation.isRunning"
        @resetSimulation="resetSimulation"
        @runSimulation="runSimulation"
        @stopSimulation="stopSimulation"
      />
    </div>
    <div class="col-right">
      <VehicleList
        :vehicles="Array.from(vehicles.values())"
        title="Fahrzeuge"
        @addVehicle="addVehicle"
        @deleteVehicle="deleteVehicle"
        @programUpload="programUpload"
        @stopSimulation="stopSimulation"
        @toggleTracking="toggleTracking"
      />
      <LogArea ref="logArea" title="Log" />
    </div>
  </div>
</template>

<script>
import SimulationArea from "@/components/SimulationArea.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import VehicleList from "@/components/VehicleList.vue";
import LogArea from "@/components/LogArea.vue";
import readMakeCodeFileAsynchronous from "@/compositions/FileHandler";
import Simulation from "@/compositions/simulation/Simulation";
import parseProgramCode from "@/compositions/Parser";
import Konva from "konva";
import Vehicle from "@/compositions/Vehicle";

export default {
  name: "App",
  components: {
    LogArea,
    SimulationArea,
    ButtonBar,
    VehicleList,
  },
  data() {
    return {
      vehicles: new Map(),
      objects: [],
      simulation: new Simulation(),
      vehicleLayer: new Konva.Layer(),
      vehicleImages: new Map(),
      animation: null,
    };
  },
  created() {
    //TODO for testing
    let vehicle = new Vehicle("red", "test");
    vehicle.program = parseProgramCode(
      "LOI_MV.antrieb(8, 2)\nbasic.pause(2000)\n" +
        "LOI_MV.antrieb(-8, 2)\nbasic.pause(2000)\n" +
        "LOI_MV.antrieb(8, -2)\nbasic.pause(2000)\n" +
        "LOI_MV.antrieb(-8, -2)\nbasic.pause(2000)\n" +
        "LOI_MV.antrieb(0, 0)\n"
      // "LOI_MV.graddrehung(90, 0)\n"
    );
    this.vehicles.set(vehicle.id, vehicle);
    let robo = new Vehicle("green", "robo");
    robo.program = parseProgramCode(
      "LOI_MV.antrieb(10, 0)\nbasic.pause(1000)\nLOI_MV.antrieb(0, 0)\n"
      // "LOI_MV.graddrehung(-90, 0)\n"
    );
    this.vehicles.set(robo.id, robo);

    this.drawAllVehiclesInside(this.vehicleLayer);
  },
  updated() {
    if (
      !this.simulation.isRunning &&
      this.animation &&
      this.animation.isRunning
    ) {
      this.animation.stop();
    }
  },
  methods: {
    runSimulation() {
      // TODO erst den Untergrund des Canvas nehmen?
      this.animation = new Konva.Animation(() => {
        this.vehicles.forEach((vehicle, id) => {
          let image = this.vehicleImages.get(id);
          image.x(this.convertToPixels(vehicle.pose.x));
          image.y(this.convertToPixels(vehicle.pose.y));
          image.rotate(vehicle.pose.theta - image.rotation());
        });
      }, this.vehicleLayer);
      this.animation.start();
      this.simulation.start(
        Array.from(this.vehicles.values()),
        this.$refs.logArea
      );
    },
    stopSimulation() {
      this.simulation.stop();
      if (this.animation && this.animation.isRunning) {
        this.animation.stop();
      }
    },
    resetSimulation() {
      this.stopSimulation();
      this.$refs.logArea.$data.output = "";
      this.vehicles.forEach((vehicle, id) => {
        vehicle.pose = vehicle.startPose;
        let image = this.vehicleImages.get(id);
        image.x(this.convertToPixels(vehicle.pose.x));
        image.y(this.convertToPixels(vehicle.pose.y));
        image.rotation(vehicle.pose.theta);
      });
    },
    addVehicle(vehicle) {
      this.vehicles.set(vehicle.id, vehicle);
      this.drawSingleVehicleInside(this.vehicleLayer, vehicle);
    },
    deleteVehicle(id) {
      this.vehicles.delete(id);
      this.vehicleImages.delete(id);
      this.drawAllVehiclesInside(this.vehicleLayer);
    },
    toggleTracking(id) {
      this.vehicles.get(id).isTracked = !this.vehicles.get(id).isTracked;
    },
    async programUpload(id, file) {
      await readMakeCodeFileAsynchronous(file).then(
        (result) => (this.vehicles.get(id).program = parseProgramCode(result))
      );
    },
    drawAllVehiclesInside(layer) {
      layer.destroyChildren();
      this.animations = [];
      this.vehicles.forEach((vehicle) => {
        this.drawSingleVehicleInside(layer, vehicle);
      });
    },
    drawSingleVehicleInside(layer, vehicle) {
      let image = new Image();
      image.src = require(`@/assets/top-${vehicle.color}.png`);
      image.onload = () => {
        let konvaImage = new Konva.Image({
          image: image,
          x: this.convertToPixels(vehicle.pose.x),
          y: this.convertToPixels(vehicle.pose.y),
          rotation: vehicle.pose.theta,
          // Verhältnis Roboter zu DIN-A0
          width: layer.canvas.width * 0.206,
          height: layer.canvas.height * 0.1938,
          offsetX: (layer.canvas.width / 2) * 0.206,
          offsetY: (layer.canvas.height / 2) * 0.1938,
          draggable: true,
        });
        layer.add(konvaImage);
        this.vehicleImages.set(vehicle.id, konvaImage);

        let transformer = new Konva.Transformer({
          nodes: [konvaImage],
          centeredScaling: true,
          rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
          resizeEnabled: false,
          borderEnabled: false,
          anchorSize: 0,
          borderStroke: "lightsteelblue",
          anchorStroke: "lightsteelblue",
          anchorFill: "lightsteelblue",
          borderStrokeWidth: 2,
        });
        layer.add(transformer);

        konvaImage.on("mouseenter", () => {
          document.body.style.cursor = "grab";
          transformer.borderEnabled(true);
          transformer.anchorSize(10);
        });
        konvaImage.on("mousedown", () => {
          this.$emit("stopSimulation");
          document.body.style.cursor = "grabbing";
        });
        konvaImage.on("mouseup", () => (document.body.style.cursor = "grab"));
        konvaImage.on("mouseout", () => {
          document.body.style.cursor = "default";
          setTimeout(() => {
            if (!transformer.isTransforming()) {
              transformer.borderEnabled(false);
              transformer.anchorSize(0);
            }
          }, 2000);
        });
        konvaImage.on("dragend", () => {
          vehicle.pose = {
            x: this.convertToMeters(konvaImage.x()),
            y: this.convertToMeters(konvaImage.y()),
            theta: konvaImage.rotation(),
          };
        });
        konvaImage.on("transformstart", () => this.$emit("stopSimulation"));
        konvaImage.on("transformend", () => {
          vehicle.pose = {
            x: this.convertToMeters(konvaImage.x()),
            y: this.convertToMeters(konvaImage.y()),
            theta: (konvaImage.rotation() + 360) % 360,
          };
          setTimeout(() => {
            transformer.borderEnabled(false);
            transformer.anchorSize(0);
          }, 2000);
        });
      };
    },
    convertToPixels(meter) {
      // Größenverhältnis zu DIN-A0
      return (meter / 1.189) * this.vehicleLayer.width();
    },
    convertToMeters(pixel) {
      // Größenverhältnis zu DIN-A0
      return (pixel * 1.189) / this.vehicleLayer.width();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.vm-titlebar,
.vm-content {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px darkgray;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 5px;
}

* {
  box-sizing: border-box;
  scrollbar-width: thin;
}

.row::after {
  content: "";
  clear: both;
  display: table;
}

[class*="col-"] {
  float: left;
  padding: 1vw;
}

.col-left {
  /* 8/12 */
  width: 66.66%;
}

.col-middle {
  /* 1/12 */
  width: 8.33%;
}

.col-right {
  /* 3/12 */
  width: 25%;
  height: 98vh;
  display: flex;
  flex-direction: column;
}
</style>