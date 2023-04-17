<template>
  <div class="container">
    <label class="label" for="row">{{ vehicle.label }}</label>
    <label class="fileName">{{ fileName }}</label>
    <div id="row" class="row">
      <div class="img-container">
        <img
          id="img"
          :alt="`${vehicle.color}`"
          :src="require(`@/assets/side-${vehicle.color}.png`)"
        />
      </div>
      <div class="button-group">
        <input
          id="fileInput"
          ref="fileInput"
          accept=".hex"
          hidden
          type="file"
          @input="handleFileUpload"
        />
        <ControlButton
          color="orange"
          description="Programm hochladen"
          icon="fas fa-file-arrow-up"
          @btn-click="selectFile"
        />
        <ToggleButton
          :is-enabled="vehicle.isTracked"
          description-disabled="Fahrstrecke anzeigen"
          description-enabled="Fahrstrecke ausblenden"
          icon="fas fa-shuffle"
          @toggle="$emit('toggleTracking')"
        />
        <ControlButton
          color="red"
          description="Fahrzeug löschen"
          icon="fas fa-trash-can"
          @btn-click="showDeleteModal = true"
        />
      </div>
    </div>
  </div>
  <VueModal v-model="showDeleteModal" title="Bitte bestätigen">
    <div>
      <label
        >Möchtest du das Fahrzeug "{{ vehicle.label }}" wirklich löschen?</label
      >
      <div class="modal-button-group">
        <button class="submit-button" @click="$emit('deleteVehicle')">
          Ja, löschen
        </button>
        <button class="close-button" @click="showDeleteModal = false">
          Nein
        </button>
      </div>
    </div>
  </VueModal>
</template>

<script>
import ControlButton from "@/components/ControlButton.vue";
import ToggleButton from "@/components/ToggleButton.vue";
import VueModal from "@kouts/vue-modal";

export default {
  name: "VehicleItem",
  components: {
    ControlButton,
    ToggleButton,
    VueModal,
  },
  data() {
    return {
      showDeleteModal: false,
      fileName: "",
    };
  },
  props: {
    vehicle: Object,
  },
  emits: ["toggleTracking", "deleteVehicle", "programUpload"],
  methods: {
    selectFile() {
      this.$parent.$emit("stopSimulation");
      this.$refs.fileInput.click();
    },
    handleFileUpload() {
      let fileName = this.$refs.fileInput.files[0].name;
      if (
        fileName.length > 13 &&
        (fileName.startsWith("microbit-") || fileName.startsWith("microbit_"))
      ) {
        fileName = fileName.slice(9);
      }
      this.fileName = fileName.slice(0, fileName.lastIndexOf("."));
      this.$parent.$emit(
        "programUpload",
        this.vehicle.id,
        this.$refs.fileInput.files[0]
      );
      this.$refs.fileInput.value = "";
    },
  },
};
</script>

<style scoped>
.container * {
  padding: 5px;
  float: left;
}

.container:after {
  content: "";
  clear: both;
  display: table;
}

.label {
  margin-bottom: -20px;
  margin-left: 5px;
  font-weight: bold;
  color: steelblue;
}

.fileName {
  margin-bottom: -20px;
  margin-left: 5px;
  color: lightsteelblue;
  font-size: 10pt;
}

.row {
  padding-bottom: 0;
  border-bottom: 3px solid lightsteelblue;
  display: flex;
  align-items: center;
}

.button-group {
  width: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-group:after {
  content: "";
  clear: both;
  display: table;
}

.button-group > * {
  float: left;
  width: 33.3%;
  margin: 5px;
}

.img-container {
  width: 35%;
}

.img-container img {
  display: block;
  width: 100%;
  height: auto;
}

.modal-button-group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
}

.modal-button-group > * {
  display: inline-block;
  width: 50%;
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  color: white;
}

.submit-button {
  margin-left: 0;
  background: crimson;
}

.close-button {
  margin-right: 0;
  background: steelblue;
}
</style>
