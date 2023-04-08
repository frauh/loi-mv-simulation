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
        :vehicles="vehicles"
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
      vehicles: [],
      objects: [],
      simulation: new Simulation(this.$refs.logArea),
      vehicleLayer: new Konva.Layer(),
      vehicleImages: new Map(),
      animation: null,
    };
  },
  created() {
    //TODO for testing
    let vehicle = new Vehicle("red", "test");
    vehicle.program = parseProgramCode(
      // "LOI_MV.antrieb(10, 3)\nbasic.pause(2000)\nLOI_MV.antrieb(0, 0)\n"
      "LOI_MV.graddrehung(90, 0)\n"
    );
    this.vehicles.push(vehicle);
    // let robo = new Vehicle("green", "robo");
    // robo.program = parseProgramCode(
    //   "LOI_MV.antrieb(10, 0)\nbasic.pause(1000)\nLOI_MV.antrieb(0, 0)\n"
    //   // "LOI_MV.graddrehung(-90, 0)\n"
    // );
    // this.vehicles.push(robo);
    this.drawVehiclesInside(this.vehicleLayer);
  },
  updated() {
    if (!this.simulation.isRunning) {
      if (this.animation && this.animation.isRunning) {
        this.animation.stop();
      }
    }
  },
  methods: {
    runSimulation() {
      // TODO erst den Untergrund des Canvas nehmen?
      this.animation = new Konva.Animation(() => {
        this.vehicles.forEach((vehicle) => {
          let image = this.vehicleImages.get(vehicle.id);
          image.x(this.convertToPixels(vehicle.pose.x));
          image.y(this.convertToPixels(vehicle.pose.y));
          image.rotate(vehicle.pose.theta - image.rotation());
        });
      }, this.vehicleLayer);
      this.animation.start();
      this.simulation.vehicles = this.vehicles;
      this.simulation.start();
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
      this.vehicles.forEach((vehicle) => {
        console.log("Pose", vehicle.pose, "start", vehicle.startPose);
        vehicle.pose = vehicle.startPose;
        this.vehicles.forEach((vehicle) => {
          let image = this.vehicleImages.get(vehicle.id);
          image.x(this.convertToPixels(vehicle.pose.x));
          image.y(this.convertToPixels(vehicle.pose.y));
          image.rotation(vehicle.pose.theta);
        });
      });
    },
    addVehicle(vehicle) {
      this.vehicles = [...this.vehicles, vehicle];
      this.drawVehiclesInside(this.vehicleLayer);
    },
    deleteVehicle(id) {
      this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== id);
      this.vehicleImages.delete(id);
      this.drawVehiclesInside(this.vehicleLayer);
    },
    toggleTracking(id) {
      this.vehicles = this.vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, isTracked: !vehicle.isTracked }
          : vehicle
      );
    },
    async programUpload(id, file) {
      await readMakeCodeFileAsynchronous(file).then(
        (result) =>
          (this.vehicles = this.vehicles.map((vehicle) =>
            vehicle.id === id
              ? { ...vehicle, program: parseProgramCode(result) }
              : vehicle
          ))
      );
    },
    drawVehiclesInside(layer) {
      layer.destroyChildren();
      this.animations = [];
      this.vehicles.forEach((vehicle) => {
        let image = new Image();
        image.src = require(`@/assets/top-${vehicle.color}.png`);
        image.onload = () => {
          let robot = new Konva.Image({
            image: image,
            x: this.convertToPixels(vehicle.pose.x),
            y: this.convertToPixels(vehicle.pose.y),
            rotation: vehicle.pose.theta,
            // Verhältnis Roboter zu DIN-A0
            width: layer.canvas.width * 0.206,
            height: layer.canvas.height * 0.1938,
            offsetX: (layer.canvas.width * 0.206) / 2,
            offsetY: (layer.canvas.height * 0.1938) / 2,
            draggable: true,
          });
          layer.add(robot);
          this.vehicleImages.set(vehicle.id, robot);

          let transformer = new Konva.Transformer({
            nodes: [robot],
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

          robot.on("mouseenter", () => {
            document.body.style.cursor = "grab";
            transformer.borderEnabled(true);
            transformer.anchorSize(10);
          });
          robot.on("mousedown", () => {
            this.$emit("stopSimulation");
            document.body.style.cursor = "grabbing";
          });
          robot.on("mouseup", () => (document.body.style.cursor = "grab"));
          robot.on("mouseout", () => {
            document.body.style.cursor = "default";
            setTimeout(() => {
              if (!transformer.isTransforming()) {
                transformer.borderEnabled(false);
                transformer.anchorSize(0);
              }
            }, 2000);
          });
          robot.on(
            "dragend",
            () =>
              (vehicle.pose = {
                x: this.convertToMeters(robot.x()),
                y: this.convertToMeters(robot.y()),
                theta: robot.rotation(),
              })
          );
          robot.on("transformstart", () => this.$emit("stopSimulation"));
          robot.on("transformend", () => {
            vehicle.pose = {
              x: this.convertToMeters(robot.x()),
              y: this.convertToMeters(robot.y()),
              theta: (robot.rotation() + 360) % 360,
            };
            setTimeout(() => {
              transformer.borderEnabled(false);
              transformer.anchorSize(0);
            }, 2000);
          });
        };
      });
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