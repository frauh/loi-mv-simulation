export default class Vehicle {
    #standardOrientations = [0, 45, 90, 135, 180, 225, 270, 315];
    id = 0;
    color = "";
    label = "";
    isTracked = false;
    program = {start: "", functions: []};
    pose = {x: 0.0, y: 0.0, theta: 0.0};
    previousStartPose = {x: 0, y: 0, theta: 0};

    constructor(color, label) {
        this.id = Math.floor(Math.random() * 100000);
        this.color = color;
        this.label = label;
        this.pose = this.previousStartPose = {
            x: 0.3 + Math.random() * 0.75,
            y: 0.15 + Math.random() * 0.6,
            theta: this.#standardOrientations[Math.floor(Math.random() * this.#standardOrientations.length)],
        };
    }
}
