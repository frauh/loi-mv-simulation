<template>
  <div class="row">
    <div class="col-left">
      <SimulationArea
        ref="simulationArea"
        :background-layer="backgroundLayer"
        :vehicle-layer="vehicleLayer"
        title="Simulation"
      />
    </div>
    <div class="col-middle">
      <ButtonBar
        :drawing-enabled="drawingEnabled"
        :erasing-enabled="erasingEnabled"
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
import { toMeter, toPixel } from "@/compositions/Consts";

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
      animation: null,
      backgroundLayer: new Konva.Layer(),
      drawingEnabled: false,
      erasingEnabled: false,
    };
  },
  created() {
    //TODO for testing
    let vehicle = new Vehicle("green", "test");
    vehicle.program = parseProgramCode(
      "LOI_MV.init(false)\n" +
        "let strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)\n" +
        "strip.showRainbow(1, 360)\n" +
        "LOI_MV.antrieb(10, 0)\n" +
        "basic.pause(2000)\n" +
        "LOI_MV.antrieb(0, 0)\n"
      // "LOI_MV.graddrehung(90, 0)\n"
    );
    this.vehicles.set(vehicle.id, vehicle);
    this.drawVehicleModelInto(this.vehicleLayer, vehicle);
    let robo = new Vehicle("blue", "robo");
    robo.program = parseProgramCode(
      "LOI_MV.antrieb(10, 3)\nbasic.pause(3000)\nLOI_MV.antrieb(0, 0)\n"
      // "LOI_MV.graddrehung(-90, 0)\n"
    );
    this.vehicles.set(robo.id, robo);
    this.drawVehicleModelInto(this.vehicleLayer, robo);
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
        this.backgroundLayer,
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
        this.vehicleModels.get(id).setAttrs({
          x: toPixel(vehicle.pose.x, this.vehicleLayer.width()),
          y: toPixel(vehicle.pose.y, this.vehicleLayer.width()),
          rotation: vehicle.pose.theta,
        });
      });
    },
    addVehicle(vehicle) {
      this.vehicles.set(vehicle.id, vehicle);
      this.drawVehicleModelInto(this.vehicleLayer, vehicle);
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
    drawVehicleModelInto(layer, vehicle) {
      let image = new Image();
      image.src = require(`@/assets/top-${vehicle.color}.png`);
      image.onload = () => {
        // Linie zum Fahrspur verfolgen
        let trace = new Konva.Line({
          stroke: vehicle.color,
          strokeWidth: 2,
          lineCap: "round",
          lineJoin: "round",
        });
        layer.add(trace);
        this.vehicleTraces.set(vehicle.id, trace);

        // Gruppe, in der alle Formen enthalten sind
        let model = new Konva.Group({
          x: toPixel(vehicle.pose.x, this.vehicleLayer.width()),
          y: toPixel(vehicle.pose.y, this.vehicleLayer.width()),
          rotation: vehicle.pose.theta,
          draggable: true,
        });
        layer.add(model);
        this.vehicleModels.set(vehicle.id, model);

        // Abbildung des Roboters
        let topView = new Konva.Image({
          image: image,
          // Verhältnis Roboter zu DIN-A0
          width: layer.canvas.width * 0.206,
          height: layer.canvas.height * 0.1938,
          // Drehung um den Mittelpunkt der Achsen, nicht des Bildes
          offsetX:
            (layer.canvas.width / 2) * 0.206 -
            toPixel(0.0115, this.vehicleLayer.width()),
          offsetY: (layer.canvas.height / 2) * 0.1938,
        });
        model.add(topView);

        // NeoPixel, der auf dem Fahrzeug dargestellt wird
        let neoPixel = new Konva.Circle({
          x: toPixel(0.075, this.vehicleLayer.width()),
          radius: toPixel(0.02, this.vehicleLayer.width()),
          fill:
            vehicle.neoPixelColor !== "rainbow" ? vehicle.neoPixelColor : "",
          fillRadialGradientStartPoint: { x: 0, y: 0 },
          fillRadialGradientStartRadius: 0,
          fillRadialGradientEndPoint: { x: 0, y: 0 },
          fillRadialGradientEndRadius: toPixel(0.02, this.vehicleLayer.width()),
          fillRadialGradientColorStops:
            vehicle.neoPixelColor === "rainbow"
              ? [
                  0,
                  "purple",
                  2 / 6,
                  "blue",
                  3 / 6,
                  "green",
                  4 / 6,
                  "yellow",
                  5 / 6,
                  "orange",
                  1,
                  "red",
                ]
              : [],
        });
        model.add(neoPixel);

        // macht das Modell drehbar
        let transformer = new Konva.Transformer({
          nodes: [model],
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

        // Eventhandling insbes. fürs Transformieren
        let mouseOver = false;
        model.on("mouseenter", () => {
          if (!this.drawingEnabled && !this.drawingEnabled) {
            document.body.style.cursor = "grab";
            transformer.borderEnabled(true);
            transformer.anchorSize(10);
            mouseOver = true;
          }
        });
        model.on("mousedown", () => {
          this.stopSimulation();
          document.body.style.cursor = "grabbing";
        });
        model.on("mouseup", () => (document.body.style.cursor = "grab"));
        model.on("mouseout", () => {
          document.body.style.cursor = "default";
          mouseOver = false;
          setTimeout(() => {
            if (!transformer.isTransforming()) {
              if (!mouseOver) {
                transformer.borderEnabled(false);
                transformer.anchorSize(0);
              }
            }
          }, 2000);
        });
        model.on("dragend", () => {
          vehicle.pose = {
            x: toMeter(model.x(), this.vehicleLayer.width()),
            y: toMeter(model.y(), this.vehicleLayer.width()),
            theta: model.rotation(),
          };
        });
        model.on("transformstart", () => this.$emit("stopSimulation"));
        model.on("transformend", () => {
          vehicle.pose = {
            x: toMeter(model.x(), this.vehicleLayer.width()),
            y: toMeter(model.y(), this.vehicleLayer.width()),
            theta: (model.rotation() + 360) % 360,
          };
          setTimeout(() => {
            if (!mouseOver) {
              transformer.borderEnabled(false);
              transformer.anchorSize(0);
            }
          }, 2000);
        });
      };
    },
    createAnimation() {
      this.vehicles.forEach((vehicle, id) => {
        // Kinematik
        let model = this.vehicleModels.get(id);
        model.x(toPixel(vehicle.pose.x, this.vehicleLayer.width()));
        model.y(toPixel(vehicle.pose.y, this.vehicleLayer.width()));
        model.rotate(vehicle.pose.theta - model.rotation());

        // Neopixel wird ggf. ein oder ausgeschaltet
        model
          .getChildren((node) => node.getClassName() === "Circle")[0]
          .setAttrs({
            fill:
              vehicle.neoPixelColor !== "rainbow" ? vehicle.neoPixelColor : "",
            fillRadialGradientColorStops:
              vehicle.neoPixelColor === "rainbow"
                ? [
                    0,
                    "purple",
                    2 / 6,
                    "blue",
                    3 / 6,
                    "green",
                    4 / 6,
                    "yellow",
                    5 / 6,
                    "orange",
                    1,
                    "red",
                  ]
                : [],
          });

        // gefahrene Wegstrecke anzeigen
        if (vehicle.isTracked) {
          let trace = this.vehicleTraces.get(vehicle.id);
          trace.points(trace.points().concat([model.x(), model.y()]));
        }
      });
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
      this.$refs.simulationArea.stopManipulatingBackground();
    },
    uploadBackgroundImage(file) {
      const URL = window.webkitURL || window.URL;
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const konvaImage = new Konva.Image({
          image: image,
          x: 0,
          y: 0,
          width: this.backgroundLayer.width(),
          height: this.backgroundLayer.height(),
          rotation: image.width > image.height ? 0 : 90,
          listening: false,
        });
        this.backgroundLayer.add(konvaImage);
        konvaImage.moveToBottom();
        konvaImage.moveUp();
      };
    },
    removeBackgroundImage() {
      this.backgroundLayer
        .getChildren((node) => node.getClassName() === "Image")[0]
        .destroy();
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
