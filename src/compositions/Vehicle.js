export default class Vehicle {

    id = 0;
    color = "";
    label = "";
    isTracked = false;
    program = [];
    pose = [0, 0, 0];

    constructor(color, label) {
        this.id = Math.floor(Math.random() * 100000);
        this.color = color;
        this.label = label;
        //TODO Start für position und orientation setzen (für späteren drag and drop)
        const x = Math.floor(Math.random() * 79);
        const y = Math.floor(Math.random() * 80);
        const standardOrientations = [0, 45, 90, 135, 180, 225, 270, 315];
        const theta = standardOrientations[Math.floor(Math.random() * standardOrientations.length)]
        this.pose = [x, y, theta]
    }

}