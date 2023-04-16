<template>
  <div class="area">
    <div id="container" ref="container" class="container"></div>
    <h3 class="heading-left">{{ title }}</h3>
  </div>
</template>

<script>
import Konva from "konva";
import {
  neoPixelConst,
  randomPosition,
  ratioConst,
  setStageWidth,
  toMeter,
  toPixel,
  vehicleConst,
} from "@/compositions/Consts";

export default {
  name: "SimulationArea",
  props: {
    title: String,
    vehicleLayer: Konva.Layer,
    vehicleModels: Map,
    vehicleTraces: Map,
    backgroundLayer: Konva.Layer,
    obstacleLayer: Konva.Layer,
    removingObstacles: Boolean,
  },
  emits: ["stopSimulation", "stopRemovingObstacles"],
  data() {
    return {
      stage: Konva.Stage,
      width: Number,
      height: Number,
      aspectRatio: ratioConst.background,
      cursorSize: 24,
      isDrawing: false,
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
    this.stage.add(this.backgroundLayer, this.obstacleLayer, this.vehicleLayer);
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
        this.addMouseEventsTo(model, transformer);
        model.on("dragend", () => {
          vehicle.pose = {
            x: toMeter(model.x()),
            y: toMeter(model.y()),
            theta: model.rotation(),
          };
        });
        model.on("transformend", () => {
          vehicle.pose = {
            x: toMeter(model.x()),
            y: toMeter(model.y()),
            theta: (model.rotation() + 360) % 360,
          };
        });
      };
    },
    manipulateBackground(draw, size) {
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
      this.useFontAwesomeCursor(draw ? "\uf304" : "\uf12d", true);
    },
    stopManipulating() {
      this.stage.off(
        "mousedown touchstart mouseup touchend mousemove touchmove mouseover mouseout"
      );
      this.$refs.container.style.cursor = "";
    },
    addObstacle(shape) {
      let obstacle;
      let transformer;
      const size = 70;
      switch (shape) {
        case "circle":
          obstacle = new Konva.Circle({
            radius: size,
            fillLinearGradientStartPoint: { x: -size, y: -size },
            fillLinearGradientEndPoint: { x: size, y: size },
          });
          transformer = new Konva.Transformer({
            enabledAnchors: [
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ],
          });
          break;
        case "rectangle":
          obstacle = new Konva.Rect({
            width: size * 2,
            height: size * 2,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: size * 2, y: size * 2 },
          });
          transformer = new Konva.Transformer({});
          break;
        default:
          return;
      }
      obstacle.setAttrs({
        x: randomPosition().x,
        y: randomPosition().y,
        stroke: "black",
        strokeWidth: 3,
        strokeScaleEnabled: false,
        fillLinearGradientColorStops: this.calculateObstacleFilling(size),
        draggable: true,
        shadowColor: "black",
        shadowBlur: 5,
        shadowOffset: { x: 3, y: 3 },
        shadowOpacity: 0.5,
      });
      this.obstacleLayer.add(obstacle);

      transformer.setAttrs({
        nodes: [obstacle],
        keepRatio: true,
        rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
        borderEnabled: false,
        anchorSize: 0,
        borderStroke: "lightsteelblue",
        anchorStroke: "lightsteelblue",
        anchorFill: "lightsteelblue",
        borderStrokeWidth: 2,
      });
      this.obstacleLayer.add(transformer);

      this.addMouseEventsTo(obstacle, transformer);
      obstacle.on("mousedown", () => {
        if (this.removingObstacles) {
          this.$emit("stopRemovingObstacles");
          obstacle.destroy();
          transformer.destroy();
        }
      });
      obstacle.on("transformend", () =>
        obstacle.setAttrs({
          fillLinearGradientColorStops: this.calculateObstacleFilling(
            obstacle.width() * obstacle.scale().x
          ),
          shadowColor: "black",
          shadowBlur: 5,
          shadowOffset: { x: 3, y: 3 },
          shadowOpacity: 0.5,
        })
      );
    },
    calculateObstacleFilling(width) {
      let result = [];
      let step = 1 / width;
      let thickness = Math.floor(width / 10);
      for (let i = 0; i < width; i++) {
        if (i % (2 * thickness) < thickness) {
          result.push(i * step, "yellow");
        } else {
          result.push(i * step, "black");
        }
      }
      return result;
    },
    removeObstacle() {
      this.useFontAwesomeCursor("\uf05e");
    },
    addMouseEventsTo(konvaObject, transformer) {
      let mouseOver = false;
      konvaObject.on("mouseenter", () => {
        if (
          !this.drawingEnabled &&
          !this.drawingEnabled &&
          !this.removingObstacles
        ) {
          document.body.style.cursor = "grab";
          transformer.borderEnabled(true);
          transformer.anchorSize(10);
          mouseOver = true;
        }
      });
      konvaObject.on("mousedown", () => {
        this.$emit("stopSimulation");
        if (
          !this.drawingEnabled &&
          !this.drawingEnabled &&
          !this.removingObstacles
        ) {
          document.body.style.cursor = "grabbing";
        }
      });
      konvaObject.on("mouseup", () => (document.body.style.cursor = "grab"));
      konvaObject.on("mouseout", () => {
        document.body.style.cursor = "default";
        mouseOver = false;
        setTimeout(() => {
          if (!transformer.isTransforming()) {
            if (transformer && !mouseOver) {
              transformer.borderEnabled(false);
              transformer.anchorSize(0);
            }
          }
        }, 2000);
      });
      konvaObject.on("transformstart", () => this.$emit("stopSimulation"));
      konvaObject.on("transformend", () => {
        setTimeout(() => {
          if (!mouseOver) {
            transformer.borderEnabled(false);
            transformer.anchorSize(0);
          }
        }, 2000);
      });
    },
    useFontAwesomeCursor(icon, rotate = false) {
      const canvas = document.createElement("canvas");
      canvas.width = this.cursorSize;
      canvas.height = this.cursorSize;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "steelblue";
      ctx.font = this.cursorSize.toString().concat("px FontAwesome");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (rotate) {
        ctx.translate(this.cursorSize, 0);
        ctx.rotate(Math.PI / 2);
      }
      ctx.fillText(icon, this.cursorSize / 2, this.cursorSize / 2);
      const dataURL = canvas.toDataURL("image/png");
      this.$refs.container.style.cursor = "url(" + dataURL + "), auto";
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
  aspect-ratio: v-bind("aspectRatio");
}
</style>
