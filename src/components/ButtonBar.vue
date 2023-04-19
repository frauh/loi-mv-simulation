<template>
  <div class="btn-group">
    <ControlButton
      :style="isRunning ? 'display:none' : 'display:inherit'"
      color="green"
      description="Simulation starten"
      icon="fas fa-play"
      @btn-click="$emit('runSimulation')"
    />
    <ControlButton
      :style="isRunning ? 'display:inherit' : 'display:none'"
      color="crimson"
      description="Simulation stoppen"
      icon="fas fa-stop"
      @btn-click="$emit('stopSimulation')"
    />
    <ControlButton
      color="blue"
      description="Simulation auf Ausgangspunkt zurücksetzen"
      icon="fas fa-rotate-left"
      style="margin-top: 0"
      @btn-click="$emit('resetSimulation')"
    />
    <br />
    <br />
    <ToggleButton
      :is-enabled="erasingEnabled || drawingEnabled"
      description="Untergrund bearbeiten"
      icon="fas fa-image"
      @toggle="callEditBackground"
    />
    <ToggleButton
      :is-enabled="removingObstacles"
      description="Hindernis hinzufügen"
      icon="fas fa-car-burst"
      @toggle="callEditObstacles"
    />
  </div>
  <VueModal v-model="showBackgroundModal" title="Untergrund bearbeiten">
    <div class="modal-column">
      <div class="modal-row">
        <input
          id="fileInput"
          ref="fileInput"
          accept="image/png"
          hidden
          type="file"
          @input="handleFileUpload"
        />
        <ControlButton
          color="orange"
          description="Untergrundbild hochladen"
          icon="fas fa-file-arrow-up"
          @btn-click="selectFile"
        />
        <label id="fileName" for="fileInput">
          {{ backgroundFileName }}
          <label
            :style="
              backgroundFileName ? 'display:inline-block' : 'display:none'
            "
            class="clickableLabel"
            for="fileName"
            @click="
              $emit('removeBackgroundImage');
              showBackgroundModal = false;
              backgroundFileName = '';
            "
            ><i class="fas fa-trash-can"></i
          ></label>
        </label>
        <ControlButton
          color="steelblue"
          description="Hintergrund herunterladen"
          icon="fas fa-file-arrow-down"
          style="margin-left: auto"
          @btn-click="
            $emit('downloadBackground');
            showBackgroundModal = false;
          "
        />
      </div>
      <div class="modal-row">
        <ControlButton
          color="steelblue"
          description="Linien auf Untergrund zeichnen"
          icon="fas fa-pen"
          @btn-click="
            $emit('drawLine', drawSize.valueOf());
            showBackgroundModal = false;
          "
        />
        <label class="description" for="drawValue">Stärke</label>
        <input
          id="drawValue"
          v-model="drawSize"
          class="slider"
          max="100"
          min="1"
          type="range"
        />
      </div>
      <div class="modal-row">
        <ControlButton
          color="steelblue"
          description="Linien vom Untergrund löschen"
          icon="fas fa-eraser"
          @btn-click="
            $emit('eraseLine', eraseSize.valueOf());
            showBackgroundModal = false;
          "
        />
        <label class="description" for="eraseValue">Stärke</label>
        <input
          id="eraseValue"
          v-model="eraseSize"
          class="slider"
          max="200"
          min="1"
          type="range"
        />
      </div>
      <div class="modal-row">
        <ControlButton
          color="blue"
          description="Alle Zeichnungen vom Untergrund löschen"
          icon="fas fa-rotate-left"
          @btn-click="
            $emit('removeLines');
            showBackgroundModal = false;
          "
        />
      </div>
    </div>
  </VueModal>
  <VueModal v-model="showObstacleModal" title="Hindernisse bearbeiten">
    <div class="modal-column">
      <div class="modal-row">
        <ControlButton
          color="steelblue"
          description="rundes Hindernis hinzufügen"
          icon="fas fa-circle-plus"
          @btn-click="
            $emit('addObstacle', 'circle');
            showObstacleModal = false;
          "
        />
        <ControlButton
          color="steelblue"
          description="viereckiges Hindernis hinzufügen"
          icon="fas fa-square-plus"
          @btn-click="
            $emit('addObstacle', 'rectangle');
            showObstacleModal = false;
          "
        />
        <ControlButton
          color="crimson"
          description="Hindernis entfernen"
          icon="fas fa-ban"
          @btn-click="
            $emit('removeObstacle');
            showObstacleModal = false;
          "
        />
      </div>
      <div class="checkbox-wrapper">
        <label for="obstacleBorder" class="description"
          >Simulationsbereich begrenzen</label
        >
        <label id="obstacleBorder" class="switch" for="checkbox">
          <input
            type="checkbox"
            id="checkbox"
            v-model="this.$parent.$data.simulationAreaBorderAsObstacle"
          />
          <div class="check-slider round"></div>
        </label>
      </div>
    </div>
  </VueModal>
</template>

<script>
import ControlButton from "@/components/ControlButton.vue";
import ToggleButton from "@/components/ToggleButton.vue";
import VueModal from "@kouts/vue-modal";

export default {
  name: "ButtonBar",
  components: { ToggleButton, ControlButton, VueModal },
  props: {
    isRunning: Boolean,
    drawingEnabled: Boolean,
    erasingEnabled: Boolean,
    removingObstacles: Boolean,
  },
  data() {
    return {
      showBackgroundModal: false,
      backgroundFileName: "",
      drawSize: 20,
      eraseSize: 40,
      showObstacleModal: false,
    };
  },
  emits: [
    "runSimulation",
    "stopSimulation",
    "resetSimulation",
    "drawLine",
    "eraseLine",
    "removeLines",
    "stopManipulatingBackground",
    "downloadBackground",
    "uploadBackgroundImage",
    "removeBackgroundImage",
    "stopRemovingObstacles",
    "addObstacle",
    "removeObstacle",
  ],
  methods: {
    callEditBackground() {
      this.$emit("stopSimulation");
      if (this.removingObstacles) {
        this.$emit("stopRemovingObstacles");
      }
      if (this.drawingEnabled || this.erasingEnabled) {
        this.$emit("stopManipulatingBackground");
      } else {
        this.showBackgroundModal = true;
      }
    },
    selectFile() {
      this.$refs.fileInput.click();
    },
    handleFileUpload() {
      this.backgroundFileName = this.$refs.fileInput.files[0].name;
      this.$emit("uploadBackgroundImage", this.$refs.fileInput.files[0]);
      this.$refs.fileInput.value = "";
      this.showBackgroundModal = false;
    },
    callEditObstacles() {
      this.$emit("stopSimulation");
      if (this.drawingEnabled || this.erasingEnabled) {
        this.$emit("stopManipulatingBackground");
      }
      if (this.removingObstacles) {
        this.$emit("stopRemovingObstacles");
      } else {
        this.showObstacleModal = true;
      }
    },
  },
};
</script>

<style scoped>
.btn-group > button {
  width: 80%;
  display: block;
  margin: 1vw auto;
}

.modal-column {
  display: block;
  margin-left: 0;
  margin-right: 0;
}

.modal-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin: 5px;
  border: 1px solid lightsteelblue;
  border-radius: 5px;
}

.modal-row > button {
  width: 4vw;
}

.modal-row > label {
  margin-left: auto;
}

.clickableLabel {
  color: crimson;
  cursor: pointer;
}

.description {
  margin-right: 5px;
  color: steelblue;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 70%;
  height: 5px;
  border-radius: 3px;
  background: lightgrey;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 8px;
  background: steelblue;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background: steelblue;
  cursor: pointer;
}

.checkbox-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.checkbox-wrapper .switch {
  display: inline-block;
  height: 34px;
  position: relative;
  width: 60px;
}

.checkbox-wrapper .switch input {
  display: none;
}

.checkbox-wrapper .check-slider {
  background-color: lightgray;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.4s;
}

.checkbox-wrapper .check-slider:before {
  background-color: white;
  bottom: 4px;
  content: "";
  height: 26px;
  left: 4px;
  position: absolute;
  transition: 0.4s;
  width: 26px;
}

.checkbox-wrapper input:checked + .check-slider {
  background-color: steelblue;
}

.checkbox-wrapper input:checked + .check-slider:before {
  transform: translateX(26px);
}

.checkbox-wrapper .check-slider.round {
  border-radius: 34px;
}

.checkbox-wrapper .check-slider.round:before {
  border-radius: 50%;
}
</style>
