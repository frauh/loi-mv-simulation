import Simulator from "@/compositions/simulator/Simulator";

export default class InputSimulator extends Simulator {

    getRotation() {
        return this._vehicle.pose.theta * (180/Math.PI) + 90;
    }

    simulateRunningTime() {
        return Date.now() - this._vehicle.simulationStartTime;
    }
}