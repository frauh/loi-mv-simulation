<template>
    <div id="container" ref="container" class="container">
        <!--        <canvas ref="simulationArea"></canvas>-->
        <h3 class="heading-left">{{ title }}</h3>
    </div>
</template>

<script>
// https://vuejsexamples.com/vuejs-component-for-drawing-on-canvas/
//https://dev.to/reiallenramos/drawing-in-vue-using-mousemove-event-34cg

import Konva from "konva";

export default {
    name: "SimulationArea",
    props: {
        title: String,
        vehicles: Array,
    },
    mounted() {
        let stage = new Konva.Stage({
            container: "container",
            width: this.$refs.container.clientWidth,
            height: this.$refs.container.clientHeight,
        });
        this.layer = new Konva.Layer();
        stage.add(this.layer);
        this.drawVehiclesInside(this.layer); // TODO zum Testen
    },
    updated() {
        this.drawVehiclesInside(this.layer);
    },
    methods: {
        drawVehiclesInside(layer) {
            layer.destroyChildren();
            this.vehicles.forEach((vehicle) => {
                let image = new Image();
                image.src = require(`@/assets/top-${vehicle.color}.png`);
                image.onload = () => {
                    let robot = new Konva.Image({
                        image: image,
                        x: vehicle.pose.x,
                        y: vehicle.pose.y, //TODO y umrechnen
                        rotation: vehicle.pose.theta,
                        // Verhältnis Roboter zu DIN-A0
                        width: layer.canvas.width * 0.206,
                        height: layer.canvas.height * 0.1938,
                        draggable: true,
                    });
                    layer.add(robot);

                    let transformer = new Konva.Transformer({
                        nodes: [robot],
                        centeredScaling: true,
                        rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
                        resizeEnabled: false,
                        borderEnabled: false,
                        anchorSize: 0,
                    });
                    layer.add(transformer);

                    robot.on("mouseover", function () {
                        document.body.style.cursor = "grab";
                        transformer.borderEnabled(true);
                        transformer.anchorSize(10);
                    });
                    robot.on(
                        "mousedown",
                        () => (document.body.style.cursor = "grabbing")
                    );
                    robot.on("mouseup", () => (document.body.style.cursor = "grab"));
                    robot.on("mouseout", () => {
                        document.body.style.cursor = "default";
                        setTimeout(() => {
                            if (!transformer.isTransforming()) {
                                transformer.borderEnabled(false);
                                transformer.anchorSize(0);
                            }
                        }, 2000);
                    });
                    robot.on(
                        "dragend",
                        () =>
                            (vehicle.pose = {
                                x: robot.x(),
                                y: robot.y(),
                                theta: robot.rotation(),
                            })
                    );
                    robot.on("transformend", () => {
                        vehicle.pose = {
                            x: robot.x(),
                            y: robot.y(),
                            theta: robot.rotation(),
                        };
                        console.log("transformend")
                        setTimeout(() => {
                                transformer.borderEnabled(false);
                                transformer.anchorSize(0);
                        }, 2000);
                    });
                };
            });
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

.container {
    overflow: hidden;
    margin: auto;
    height: 100%;
    /* Seitenverhältnis DIN-A-Blätter */
    aspect-ratio: 1.414;
    background: white;
    border: 5px solid steelblue;
    border-radius: 15px;
}
</style>
