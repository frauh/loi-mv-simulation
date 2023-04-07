<template>
    <div class="row">
        <div class="col-left">
            <SimulationArea
                    :vehicles="vehicles"
                    title="Simulation"
                    @stopSimulation="stopSimulation"
            />
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
                    :vehicles="vehicles"
                    title="Fahrzeuge"
                    @addVehicle="addVehicle"
                    @deleteVehicle="deleteVehicle"
                    @programUpload="programUpload"
                    @toggleTracking="toggleTracking"
            />
            <LogArea ref="logArea" title="Log"/>
        </div>
    </div>
</template>

<script>
import SimulationArea from "@/components/SimulationArea.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import VehicleList from "@/components/VehicleList.vue";
import LogArea from "@/components/LogArea.vue";
import Vehicle from "@/compositions/Vehicle";
import readMakeCodeFileAsynchronous from "@/compositions/FileHandler";
import Simulation from "@/compositions/simulation/Simulation";
import parseProgramCode from "@/compositions/Parser";

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
            vehicles: [],
            objects: [],
            simulation: new Simulation(this.$refs.logArea),
        };
    },
    created() {
        //TODO for testing
        let vehicle = new Vehicle("red", "test");
        vehicle.program = parseProgramCode(
            // "LOI_MV.antrieb(10, 0)\nbasic.pause(100)\nLOI_MV.antrieb(0, 0)\n"
            "LOI_MV.graddrehung(90, 0)\n"
        );
        this.vehicles.push(vehicle);
    },
    methods: {
        runSimulation() {
            // TODO erst den Untergrund des Canvas nehmen?
            this.simulation.vehicles = this.vehicles;
            this.simulation.start();
        },

        stopSimulation() {
            this.simulation.stop();
        },
        resetSimulation() {
            this.stopSimulation();
            this.$refs.logArea.$data.output = "";
            this.vehicles.forEach((vehicle) => {
                vehicle.pose = vehicle.previousStartPose;
            });
        },
        addVehicle(vehicle) {
            this.vehicles = [...this.vehicles, vehicle];
        },
        deleteVehicle(id) {
            this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== id);
        },
        toggleTracking(id) {
            this.vehicles = this.vehicles.map((vehicle) =>
                vehicle.id === id
                    ? {
                        ...vehicle,
                        isTracked: !vehicle.isTracked,
                    }
                    : vehicle
            );
        },
        async programUpload(id, file) {
            // this.stopSimulation();
            await readMakeCodeFileAsynchronous(file).then(
                (result) =>
                    (this.vehicles = this.vehicles.map((vehicle) =>
                        vehicle.id === id
                            ? {
                                ...vehicle,
                                program: parseProgramCode(result),
                            }
                            : vehicle
                    ))
            );
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
