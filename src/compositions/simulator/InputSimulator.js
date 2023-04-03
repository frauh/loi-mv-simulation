import Simulator from "@/compositions/simulator/Simulator";

export default class InputSimulator extends Simulator {
    constructor(startTime) {
        super();
        this._startTime = startTime;
    }

    getRotation() {
        //FIXME
        return this._vehicle.pose.theta * (180 / Math.PI) + 90;
    }

    simulateRunningTime() {
        //FIXME
        return Date.now() - this._startTime;
    }
}
