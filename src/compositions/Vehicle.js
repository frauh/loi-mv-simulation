export default class Vehicle {

    #standardOrientations = [0, 45, 90, 135, 180, 225, 270, 315];
    id = 0;
    color = "";
    label = "";
    isTracked = false;
    program = "";
    pose = {x: 0, y: 0, theta: 0};
    previousStartPose = {x: 0, y: 0, theta: 0};
    simulationStartTime = 0;//TODO gehört eigentlich raus

    constructor(color, label) {
        this.id = Math.floor(Math.random() * 100000);
        this.color = color;
        this.label = label;
        this.pose = this.previousStartPose = {
            x: Math.floor(Math.random() * 79),
            y: Math.floor(Math.random() * 80),
            theta: this.#standardOrientations[Math.floor(Math.random() * this.#standardOrientations.length)]
        };
    }

}