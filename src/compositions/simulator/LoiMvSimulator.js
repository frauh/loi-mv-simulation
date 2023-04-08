import Simulator from "@/compositions/simulator/Simulator";
import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import {
  calculateNewPose,
  deltaT,
} from "@/compositions/simulation/KinematicModel";

export default class LoiMvSimulator extends Simulator {
  constructor(pose) {
    super();
    this._pose = pose; // 0:x, 1:y, 2:theta
    this._calculationInterval = null;
  }

  /**
   *
   * @param power Number (-10...10)
   * @param turn Number (-10...10)
   */
  simulateMotors(power, turn) {
    this.#stopCalculation();
    if (power === 0) {
      return;
    }
    let vR;
    let vL;
    if (turn < 0) {
      // Linksdrehung
      vL = this.#translateToSpeed(power + ((2 * power) / 10) * turn);
      vR = this.#translateToSpeed(power);
    } else if (turn > 0) {
      // Rechtsdrehung
      vL = this.#translateToSpeed(power);
      vR = this.#translateToSpeed(power - ((2 * power) / 10) * turn);
    } else {
      vR = vL = this.#translateToSpeed(power);
    }
    this.#startPermanentCalculation(vL, vR);
  }

  simulateRotation(angle) {
    this.#stopCalculation();
    let motorPower = 8;
    let v = this.#translateToSpeed(motorPower);
    let tolerance = 0.12 * motorPower;
    let target = (this._pose[2] + angle + 360) % 360;
    let difference = Math.abs(target - this._pose[2]);
    if (angle < 0) {
      // Linksdrehung
      this.commit(WorkerMessageKey.intervalCalculating, true);
      this._calculationInterval = setInterval(() => {
        if (Math.min(difference, 360 + difference) > tolerance) {
          this.#singleCalculation(-v, v);
          difference = Math.abs(target - this._pose[2]);
          this.commit(WorkerMessageKey.pose, this._pose);
        } else {
          this.#stopCalculation();
        }
      }, deltaT * 1000);
    } else {
      // Rechtsdrehung
      this.commit(WorkerMessageKey.intervalCalculating, true);
      this._calculationInterval = setInterval(() => {
        if (Math.min(difference, 360 - difference) > tolerance) {
          this.#singleCalculation(v, -v);
          difference = Math.abs(target - this._pose[2]);
          this.commit(WorkerMessageKey.pose, this._pose);
        } else {
          this.#stopCalculation();
        }
      }, deltaT * 1000);
    }
  }

  #startPermanentCalculation(vL, vR) {
    this.commit(WorkerMessageKey.intervalCalculating, true);
    this._calculationInterval = setInterval(() => {
      this._pose = calculateNewPose(
        this._pose[0],
        this._pose[1],
        this._pose[2],
        vL,
        vR
      );
      this.commit(WorkerMessageKey.pose, this._pose);
    }, deltaT * 1000);
  }

  #singleCalculation(vL, vR) {
    this._pose = calculateNewPose(
      this._pose[0],
      this._pose[1],
      this._pose[2],
      vL,
      vR
    );
    this.commit(WorkerMessageKey.pose, this._pose);
  }

  #stopCalculation() {
    clearInterval(this._calculationInterval);
    this._calculationInterval = null;
    this.commit(WorkerMessageKey.intervalCalculating, false);
  }

  /**
   *
   * @param power motor
   * @return {number} m/s
   */
  #translateToSpeed(power) {
    return power / 40;
  }
}
