<template>
  <div class="row">
    <button class="modal-button" type="button" @click="showModal=true"><i class="fas fa-plus"/></button>
  </div>
  <VueModal v-model="showModal" title="Neues Fahrzeug" @after-close="afterClose">
    <form>
      <div class="modal-row">
        <label for="name">Bezeichnung:</label>
        <input id="name" v-model="label" placeholder="Wie heißt dein Roboter?" type="text">
      </div>
      <div class="modal-row">
        <label for="color">Farbe:</label>
        <div v-for="(color, index) in colors" id="color" :key="index" class="img-container">
          <img :alt="`${color}`"
               :class="color === this.color ? 'img-selected' : 'img-not-selected'"
               :src="require('@/assets/side-'+`${color}`+'.png')"
               @click="chooseColor(color)">
        </div>
      </div>
      <button :disabled="!this.label || !this.color"
              class="submit-button"
              @click="onSubmit">
        OK
      </button>
    </form>
  </VueModal>
</template>

<script>
import VueModal from '@kouts/vue-modal'

export default {
  name: "AddVehicle",
  components: {
    VueModal
  },
  data() {
    return {
      showModal: false,
      colors: new Set(),
      orientations: [0, 45, 90, 135, 180, 225, 270, 315],
      label: "",
      color: "",
      isValid: false
    }
  },
  created() {
    require.context("@/assets/", true, /^.*\.png$/).keys().forEach(name => {
      this.colors.add(name.toString().match(/[^-]\w+(?=.png)/).toString())
    })
  },
  methods: {
    chooseColor(color) {
      this.color = color
    },
    onSubmit(e) {
      e.preventDefault()
      const vehicle = {
        id: Math.floor(Math.random() * 100000),
        color: this.color,
        label: this.label,
        isTracked: false,
        program: "",
        //TODO Start für position und orientation setzen (für späteren drag and drop)
        position: {x: Math.floor(Math.random() * 79), y: Math.floor(Math.random() * 80)},
        //TODO standard Orientierung setzen
        orientation: this.orientations[Math.floor(Math.random() * this.orientations.length)]
      }
      this.$parent.$emit("addVehicle", vehicle)
      this.showModal = false
    },
    afterClose() {
      this.color = ""
      this.label = ""
    }
  },
}

</script>

<style scoped>
.row {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 10px;
}

.row:after {
  content: "";
  clear: both;
  display: table;
}

.modal-row {
  display: flex;
  align-items: center;
}

.modal-row * {
  float: left;
  margin: 10px;
}

.modal-row:after {
  content: "";
  clear: both;
  display: table;
}

.img-container {
  width: 30%;
}

.img-container img {
  display: block;
  width: 100%;
  height: auto;
  cursor: pointer;
}

.img-selected, .img-not-selected:hover {
  opacity: 1;
}

.img-not-selected {
  opacity: 0.4;
  filter: alpha(opacity=40);
}

.modal-button {
  width: 1.2em;
  height: 1.2em;
  border-radius: 50%;
  background-color: lightgrey;
  color: steelblue;
  font-size: 2em;
  border: none;
  cursor: pointer;
}

.submit-button {
  display: inline-block;
  width: 100%;
  background: steelblue;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
}

.submit-button:disabled {
  background:lightsteelblue;
  cursor: initial;
}
</style>