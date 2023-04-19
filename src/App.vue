<template>
  <div class="row">
    <div class="col-left">
      <SimulationArea
        ref="simulationArea"
        :vehicle-layer="vehicleLayer"
        :vehicle-models="vehicleModels"
        :vehicle-traces="vehicleTraces"
        :background-layer="backgroundLayer"
        :obstacle-layer="obstacleLayer"
        :removing-obstacles="removingObstacles"
        :simulation-area-border-as-obstacle="simulationAreaBorderAsObstacle"
        title="Simulation"
        @stopSimulation="stopSimulation"
        @stopRemovingObstacles="stopRemovingObstacles"
      />
    </div>
    <div class="col-middle">
      <ButtonBar
        :drawing-enabled="drawingEnabled"
        :erasing-enabled="erasingEnabled"
        :removing-obstacles="removingObstacles"
        :is-running="simulation.isRunning"
        @downloadBackground="downloadBackground"
        @drawLine="drawBackground"
        @eraseLine="eraseBackground"
        @removeBackgroundImage="removeBackgroundImage"
        @removeLines="removeBackground"
        @resetSimulation="resetSimulation"
        @runSimulation="runSimulation"
        @stopManipulatingBackground="stopManipulatingBackground"
        @stopSimulation="stopSimulation"
        @uploadBackgroundImage="uploadBackgroundImage"
        @addObstacle="addObstacle"
        @removeObstacle="removeObstacle"
        @stopRemovingObstacles="stopRemovingObstacles"
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
import { neoPixelConst, toPixel } from "@/compositions/Consts";
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
      simulation: new Simulation(),
      vehicleLayer: new Konva.Layer(),
      vehicleModels: new Map(),
      vehicleTraces: new Map(),
      backgroundLayer: new Konva.Layer(),
      drawingEnabled: false,
      erasingEnabled: false,
      obstacleLayer: new Konva.Layer(),
      removingObstacles: false,
      simulationAreaBorderAsObstacle: false,
      animation: null,
    };
  },
  mounted() {
    //TODO for testing
    // let vehicle = new Vehicle("red", "test");
    // vehicle.program = parseProgramCode(
    //   "basic.forever(function () {\n" +
    //     "    LOI_MV.antrieb(10, 0)\n" +
    //     "    basic.pause(1000)\n" +
    //     "    LOI_MV.antrieb(0, 0)\n" +
    //     "    basic.pause(5000)\n" +
    //     "})"
    // );
    // this.vehicles.set(vehicle.id, vehicle);
    // this.$refs.simulationArea.drawVehicleModel(vehicle);

    let robo = new Vehicle("blue", "robo");
    robo.program = parseProgramCode(
      "basic.forever(function () {\n" +
        "    LOI_MV.antrieb(10, 0)\n" +
        "    basic.pause(1000)\n" +
        "    LOI_MV.antrieb(0, 0)\n" +
        "    basic.pause(5000)\n" +
        "})"
    );
    this.vehicles.set(robo.id, robo);
    this.$refs.simulationArea.drawVehicleModel(robo);
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
      this.vehicleTraces.forEach((trace) => trace.points([]));
      this.animation = new Konva.Animation(
        this.createAnimation,
        this.vehicleLayer
      );
      this.animation.start();
      this.simulation.start(
        Array.from(this.vehicles.values()),
        this.backgroundLayer
          .getContext("2d", { willReadFrequently: true })
          .getImageData(
            0,
            0,
            this.backgroundLayer.width(),
            this.backgroundLayer.height()
          ),
        this.identifyObstacles(),
        this.$refs.logArea,
        this.$refs.simulationArea
      );
    },
    createAnimation() {
      this.vehicles.forEach((vehicle, id) => {
        // Kinematik
        let model = this.vehicleModels.get(id);
        model.x(toPixel(vehicle.pose.x));
        model.y(toPixel(vehicle.pose.y));
        model.rotate(vehicle.pose.theta - model.rotation());

        // Neopixel wird ggf. ein oder ausgeschaltet
        model
          .getChildren((node) => node.getClassName() === "Circle")[0]
          .setAttrs({
            fill:
              vehicle.neoPixelColor !== "rainbow" ? vehicle.neoPixelColor : "",
            fillRadialGradientColorStops:
              vehicle.neoPixelColor === "rainbow" ? neoPixelConst.rainbow : [],
          });

        // gefahrene Wegstrecke anzeigen
        if (vehicle.isTracked) {
          let trace = this.vehicleTraces.get(vehicle.id);
          trace.points(trace.points().concat([model.x(), model.y()]));
        }
      });
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
        this.vehicleModels.get(id).setAttrs({
          x: toPixel(vehicle.pose.x),
          y: toPixel(vehicle.pose.y),
          rotation: vehicle.pose.theta,
        });
      });
    },
    addVehicle(vehicle) {
      this.vehicles.set(vehicle.id, vehicle);
      this.$refs.simulationArea.drawVehicleModel(vehicle);
    },
    deleteVehicle(id) {
      this.vehicles.delete(id);
      this.vehicleModels.get(id).destroy();
      this.vehicleModels.delete(id);
      this.vehicleTraces.get(id).destroy();
      this.vehicleTraces.delete(id);
    },
    toggleTracking(id) {
      this.vehicles.get(id).isTracked = !this.vehicles.get(id).isTracked;
    },
    async programUpload(id, file) {
      await readMakeCodeFileAsynchronous(file).then(
        (result) => (this.vehicles.get(id).program = parseProgramCode(result))
      );
    },
    drawBackground(size) {
      this.erasingEnabled = false;
      this.drawingEnabled = !this.drawingEnabled;
      this.$refs.simulationArea.manipulateBackground(this.drawingEnabled, size);
    },
    eraseBackground(size) {
      this.drawingEnabled = false;
      this.erasingEnabled = !this.erasingEnabled;
      this.$refs.simulationArea.manipulateBackground(this.drawingEnabled, size);
    },
    removeBackground() {
      this.backgroundLayer
        .getChildren((node) => node.getClassName() === "Line")
        .forEach((line) => line.destroy());
    },
    stopManipulatingBackground() {
      this.drawingEnabled = false;
      this.erasingEnabled = false;
      this.$refs.simulationArea.stopManipulating();
    },
    uploadBackgroundImage(file) {
      this.removeBackgroundImage();
      const URL = window.webkitURL || window.URL;
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let konvaImage;
        if (image.width > image.height) {
          konvaImage = new Konva.Image({
            image: image,
            x: 0,
            y: 0,
            width: this.backgroundLayer.width(),
            height: this.backgroundLayer.height(),
            listening: false,
          });
        } else {
          konvaImage = new Konva.Image({
            image: image,
            x: this.backgroundLayer.width() / 2,
            y: this.backgroundLayer.height() / 2,
            width: this.backgroundLayer.height(),
            height: this.backgroundLayer.width(),
            rotation: 90,
            offsetX: this.backgroundLayer.height() / 2,
            offsetY: this.backgroundLayer.width() / 2,
            listening: false,
          });
        }
        this.backgroundLayer.add(konvaImage);
        konvaImage.moveToBottom();
        konvaImage.moveUp();
      };
    },
    removeBackgroundImage() {
      let image = this.backgroundLayer.getChildren(
        (node) => node.getClassName() === "Image"
      )[0];
      if (image) {
        image.destroy();
      }
    },
    downloadBackground() {
      this.downloadURI(
        this.backgroundLayer.toDataURL({ pixelRatio: 3 }),
        "Simulationsuntergrund.png"
      );
    },
    downloadURI(uri, name) {
      let link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    addObstacle(shape) {
      this.$refs.simulationArea.addObstacle(shape);
    },
    removeObstacle() {
      this.removingObstacles = true;
      this.$refs.simulationArea.removeObstacle();
    },
    stopRemovingObstacles() {
      this.removingObstacles = false;
      this.$refs.simulationArea.stopManipulating();
    },
    identifyObstacles() {
      let obstacles = [];
      this.obstacleLayer
        .getChildren((child) => child.getClassName() !== "Transformer")
        .forEach((obstacle) =>
          obstacles.push({
            type: obstacle.getClassName(),
            position: obstacle.position(),
            width: obstacle.width() * obstacle.scaleX(),
            height: obstacle.height() * obstacle.scaleY(),
            rotation: obstacle.rotation(),
          })
        );
      if (this.simulationAreaBorderAsObstacle) {
        obstacles.push({
          type: "Rect",
          position: { x: 0, y: 0 },
          width: this.vehicleLayer.width(),
          height: this.vehicleLayer.height(),
          rotation: 0,
        });
      }
      return obstacles;
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
