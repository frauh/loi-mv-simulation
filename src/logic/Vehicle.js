export default class Vehicle {

    standardOrientations = [0, 45, 90, 135, 180, 225, 270, 315];

    id = 0;
    color = "";
    label = "";
    isTracked = false;
    program = null;
    pose = [0, 0, 0];

    constructor(color, label) {
        this.id = Math.floor(Math.random() * 100000);
        this.color = color;
        this.label = label;
        //TODO Start für position und orientation setzen (für späteren drag and drop)
        const x = Math.floor(Math.random() * 79);
        const y = Math.floor(Math.random() * 80);
        const theta = this.standardOrientations[Math.floor(Math.random() * this.standardOrientations.length)]
        this.pose = [x, y, theta]
    }

}