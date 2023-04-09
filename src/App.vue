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
      simulation: new Simulation(),
      vehicleLayer: new Konva.Layer(),
      vehicleModels: new Map(),
      vehicleTraces: new Map(),
      animation: null,
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
          x: this.convertToPixels(vehicle.pose.x),
          y: this.convertToPixels(vehicle.pose.y),
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
          x: this.convertToPixels(vehicle.pose.x),
          y: this.convertToPixels(vehicle.pose.y),
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
            (layer.canvas.width / 2) * 0.206 - this.convertToPixels(0.012),
          offsetY: (layer.canvas.height / 2) * 0.1938,
        });
        model.add(topView);

        // NeoPixel, der auf dem Fahrzeug dargestellt wird
        let neoPixel = new Konva.Circle({
          x: this.convertToPixels(0.075),
          radius: this.convertToPixels(0.02),
          fill:
            vehicle.neoPixelColor !== "rainbow" ? vehicle.neoPixelColor : "",
          fillRadialGradientStartPoint: { x: 0, y: 0 },
          fillRadialGradientStartRadius: 0,
          fillRadialGradientEndPoint: { x: 0, y: 0 },
          fillRadialGradientEndRadius: this.convertToPixels(0.02),
          fillRadialGradientColorStops:
            vehicle.neoPixelColor === "rainbow"
              ? [
                  0,
                  "purple",
                  2 / 7,
                  "blue",
                  3 / 7,
                  "lightblue",
                  4 / 7,
                  "green",
                  5 / 7,
                  "yellow",
                  6 / 7,
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
          document.body.style.cursor = "grab";
          transformer.borderEnabled(true);
          transformer.anchorSize(10);
          mouseOver = true;
        });
        model.on("mousedown", () => {
          this.$emit("stopSimulation");
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
            x: this.convertToMeters(model.x()),
            y: this.convertToMeters(model.y()),
            theta: model.rotation(),
          };
        });
        model.on("transformstart", () => this.$emit("stopSimulation"));
        model.on("transformend", () => {
          vehicle.pose = {
            x: this.convertToMeters(model.x()),
            y: this.convertToMeters(model.y()),
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
        model.x(this.convertToPixels(vehicle.pose.x));
        model.y(this.convertToPixels(vehicle.pose.y));
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
                    2 / 7,
                    "blue",
                    3 / 7,
                    "lightblue",
                    4 / 7,
                    "green",
                    5 / 7,
                    "yellow",
                    6 / 7,
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
