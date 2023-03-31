<template>
    <div class="btn-group">
        <!-- TODO bei wenig Buttons besser alles in die rechte Spalte? -->
        <ControlButton :style="isRunning ? 'display:none' : 'display:inherit'"
                       color="green"
                       description="Simulation starten"
                       icon="fas fa-play"
                       @btn-click="$emit('runSimulation')"/>
        <ControlButton :style="isRunning ? 'display:inherit' : 'display:none'"
                       color="red"
                       description="Simulation stoppen"
                       icon="fas fa-stop"
                       @btn-click="$emit('stopSimulation')"/>
        <!-- TODO zurücksetzen löscht auch den Log? -->
        <ControlButton color="blue"
                       description="Simulation auf Ausgangspunkt zurücksetzen"
                       icon="fas fa-rotate-left"
                       @btn-click="$emit('resetSimulation')"
                       style="margin-top: 0"/>
        <br/>
        <ControlButton color="orange"
                       description="Hintergrund hochladen"
                       icon="fas fa-image"/>
        <ControlButton color="black"
                       description="Hintergrund bearbeiten"
                       icon="fas fa-pen-to-square"/>
        <!-- TODO ggf. einfach weiß malen oder alle im Modal verstecken-->
        <!-- TODO Margin der Buttonbar responsive gestalten -->
        <ControlButton color="black"
                       description="Hintergrund bearbeiten"
                       icon="fas fa-eraser"/>
        <ControlButton color="black"
                       description="Hintergrund herunterladen"
                       icon="fas fa-file-arrow-down"/>
    </div>
</template>

<script>
import ControlButton from "@/components/ControlButton.vue";

export default {
    name: "ButtonBar",
    components: {ControlButton},
    props: {
        isRunning: Boolean
    },
    emits: ["runSimulation", "stopSimulation", "resetSimulation"]
}
</script>

<style scoped>
.btn-group button {
    width: 80%;
    display: block;
    margin: 1vw auto;
}
</style>