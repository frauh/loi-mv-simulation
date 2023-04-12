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
    backgroundLayer: Konva.Layer,
  },
  data() {
    return {
      stage: Konva.Stage,
      isDrawing: false,
    };
  },
  mounted() {
    this.stage = new Konva.Stage({
      container: "container",
      width: this.$refs.container.clientWidth,
      height: this.$refs.container.clientHeight,
    });
    this.stage.add(this.backgroundLayer, this.vehicleLayer);
    let background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.backgroundLayer.width(),
      height: this.backgroundLayer.height(),
      fill: "white",
      listening: false,
    });
    this.backgroundLayer.add(background);
  },
  methods: {
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
