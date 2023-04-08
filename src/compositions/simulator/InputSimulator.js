import Simulator from "@/compositions/simulator/Simulator";

export default class InputSimulator extends Simulator {
  constructor(startTime, pose) {
    super();
    this._startTime = startTime;
    this._pose = pose;
  }

  getRotation() {
    return (this.pose.theta + 90) % 360;
  }

  simulateRunningTime() {
    return Date.now() - this._startTime;
  }
}
