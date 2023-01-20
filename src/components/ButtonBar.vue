<template>
  <div class="btn-group">
    <ControlButton color="green" description="Simulation starten" icon="fas fa-play"/>
    <ControlButton color="red" description="Simulation stoppen" icon="fas fa-stop"/>
    <ControlButton color="blue" description="Simulation auf Ausgangspunkt zurücksetzen" icon="fas fa-rotate-left"/>
    <br/>
    <ControlButton color="orange" description="Hintergrund hochladen" icon="fas fa-image"/>
    <ControlButton color="black" description="Hintergrund bearbeiten" icon="fas fa-pen-to-square"/>
    <!-- TODO ggf. einfach weiß malen oder alle im Modal verstecken-->
    <ControlButton color="black" description="Hintergrund bearbeiten" icon="fas fa-eraser"/>
    <ControlButton color="black" description="Hintergrund herunterladen" icon="fas fa-file-arrow-down"/>
  </div>
</template>

<script>
import ControlButton from "@/components/ControlButton.vue";

export default {
  name: "ButtonBar",
  components: {ControlButton}
}
</script>

<style scoped>
.btn-group button {
  width: 75%;
  display: block;
  margin: 15px;
}
</style>