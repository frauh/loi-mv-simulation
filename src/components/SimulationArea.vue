<template>
  <div class="area">
    <div
      id="container"
      ref="container"
      :style="{ aspectRatio: ratioConst.background }"
      class="container"
    ></div>
    <h3 class="heading-left">{{ title }}</h3>
  </div>
</template>

<script>
import Konva from "konva";
import {
  neoPixelConst,
  ratioConst,
  setStageWidth,
  toMeter,
  toPixel,
  vehicleConst,
} from "@/compositions/Consts";

export default {
  name: "SimulationArea",
  computed: {
    ratioConst() {
      return ratioConst;
    },
  },
  props: {
    title: String,
    vehicleLayer: Konva.Layer,
    backgroundLayer: Konva.Layer,
    vehicleModels: Map,
    vehicleTraces: Map,
  },
  data() {
    return {
      stage: Konva.Stage,
      isDrawing: false,
      width: Number,
      height: Number,
    };
  },
  mounted() {
    this.width = this.$refs.container.clientWidth;
    this.height = this.$refs.container.clientHeight;
    this.stage = new Konva.Stage({
      container: "container",
      width: this.width,
      height: this.height,
    });
    this.stage.add(this.backgroundLayer, this.vehicleLayer);
    let background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      fill: "white",
      listening: false,
    });
    this.backgroundLayer.add(background);
    setStageWidth(this.width);
  },
  methods: {
    drawVehicleModel(vehicle) {
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
        this.vehicleLayer.add(trace);
        this.vehicleTraces.set(vehicle.id, trace);

        // Gruppe, in der alle Formen des Modells enthalten sind
        let model = new Konva.Group({
          x: toPixel(vehicle.pose.x),
          y: toPixel(vehicle.pose.y),
          rotation: vehicle.pose.theta,
          draggable: true,
        });
        this.vehicleLayer.add(model);
        this.vehicleModels.set(vehicle.id, model);

        // Abbildung des Roboters
        let topView = new Konva.Image({
          image: image,
          // Verhältnis Roboter zu DIN-A0
          width: this.width * ratioConst.vehicleToBackgroundWidth,
          height: this.height * ratioConst.vehicleToBackgroundHeight,
          // Drehung um den Mittelpunkt der Achsen, nicht des Bildes
          offsetX:
            (this.width / 2) * ratioConst.vehicleToBackgroundWidth -
            toPixel(vehicleConst.rotationOffset),
          offsetY: (this.height / 2) * ratioConst.vehicleToBackgroundHeight,
        });
        model.add(topView);

        // NeoPixel, der auf dem Fahrzeug dargestellt wird
        let neoPixel = new Konva.Circle({
          x: toPixel(neoPixelConst.offset),
          radius: toPixel(neoPixelConst.radius),
          fill:
            vehicle.neoPixelColor !== "rainbow" ? vehicle.neoPixelColor : "",
          fillRadialGradientStartPoint: { x: 0, y: 0 },
          fillRadialGradientStartRadius: 0,
          fillRadialGradientEndPoint: { x: 0, y: 0 },
          fillRadialGradientEndRadius: toPixel(neoPixelConst.radius),
          fillRadialGradientColorStops:
            vehicle.neoPixelColor === "rainbow" ? neoPixelConst.rainbow : [],
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
        this.vehicleLayer.add(transformer);

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
            x: toMeter(model.x()),
            y: toMeter(model.y()),
            theta: model.rotation(),
          };
        });
        model.on("transformstart", () => this.$emit("stopSimulation"));
        model.on("transformend", () => {
          vehicle.pose = {
            x: toMeter(model.x()),
            y: toMeter(model.y()),
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
    manipulateBackground(draw, size) {
      let cursorSize = 24;
      let lastLine;
      this.stage.on("mousedown touchstart", () => {
        this.isDrawing = true;
        let position = this.stage.getPointerPosition();
        lastLine = new Konva.Line({
          stroke: draw ? "black" : "white",
          strokeWidth: size,
          globalCompositeOperation: "source-over",
          lineCap: "round",
          lineJoin: "round",
          // Punkt muss zweimal hinzugefügt werden, damit dieser auch bei einem einfachen Klick erscheint
          // und nicht erst beim nächsten, wenn dazwischen die Linie gezogen wird
          points: [position.x, position.y, position.x, position.y],
          listening: false,
        });
        self.backgroundLayer.add(lastLine);
      });
      let self = this;
      this.stage.on("mouseup touchend", () => (self.isDrawing = false));
      this.stage.on("mousemove touchmove", function (ev) {
        if (self.isDrawing) {
          ev.evt.preventDefault(); // prevent scrolling on touch devices
          const position = self.stage.getPointerPosition();
          lastLine.points(lastLine.points().concat([position.x, position.y]));
        }
      });

      // Font Awesome Cursor Icon
      const canvas = document.createElement("canvas");
      canvas.width = cursorSize;
      canvas.height = cursorSize;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "steelblue";
      ctx.font = cursorSize.toString().concat("px FontAwesome");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(cursorSize, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(draw ? "\uf304" : "\uf12d", cursorSize / 2, cursorSize / 2);
      const dataURL = canvas.toDataURL("image/png");
      this.$refs.container.style.cursor = "url(" + dataURL + "), auto";
    },
    stopManipulatingBackground() {
      this.stage.off(
        "mousedown touchstart mouseup touchend mousemove touchmove mouseover mouseout"
      );
      this.$refs.container.style.cursor = "";
    },
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
  background: white;
  border: 5px solid steelblue;
  border-radius: 15px;
}

.container {
  width: 100%;
  height: 100%;
}
</style>
