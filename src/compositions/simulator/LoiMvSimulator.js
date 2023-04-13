import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import { calculateNewPose } from "@/compositions/simulation/KinematicModel";
import {
  deltaT,
  photocellConst,
  stageWidth,
  toPixel,
  toRadian,
} from "@/compositions/Consts";
import LoiMvMapper from "@/compositions/makeCodeMapper/LoiMvMapper";

export default class LoiMvSimulator extends LoiMvMapper {
  constructor(pose, backgroundImageData) {
    super();
    // [x, y, theta]
    this._pose = pose;
    this._backgroundImageData = backgroundImageData;
    this._calculationInterval = null;
  }

  /**
   *
   * @param {boolean} kompass
   */
  // eslint-disable-next-line no-unused-vars
  init(kompass) {
    // nothing to do
  }

  /**
   *
   * @param {number} drehung
   * @param {number} toleranz
   */
  // eslint-disable-next-line no-unused-vars
  graddrehung(drehung, toleranz) {
    this.#stopCalculation();
    let motorPower = 8;
    let v = this.#translateToSpeed(motorPower);
    let target = (this._pose[2] + drehung + 360) % 360;
    let difference = Math.abs(target - this._pose[2]);
    if (drehung < 0) {
      // Linksdrehung
      this.commit(WorkerMessageKey.intervalCalculating, true);
      this._calculationInterval = setInterval(() => {
        if (Math.min(difference, 360 + difference) > toleranz) {
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
        if (Math.min(difference, 360 - difference) > toleranz) {
          this.#singleCalculation(v, -v);
          difference = Math.abs(target - this._pose[2]);
          this.commit(WorkerMessageKey.pose, this._pose);
        } else {
          this.#stopCalculation();
        }
      }, deltaT * 1000);
    }
  }

  /**
   *
   * @return {0|1}
   */
  helligkeitLinks() {
    const x = Math.floor(
      toPixel(
        this._pose.x +
          Math.cos(toRadian(this._pose.theta - photocellConst.offsetAngle)) *
            photocellConst.offset
      )
    );
    const y = Math.floor(
      toPixel(
        this._pose.y +
          Math.sin(toRadian(this._pose.theta - photocellConst.offsetAngle)) *
            photocellConst.offset
      )
    );
    return this.#isDarkAtPosition(x, y);
  }

  /**
   *
   * @return {0|1}
   */
  helligkeitRechts() {
    const x = Math.floor(
      toPixel(
        this._pose.x +
          Math.cos(toRadian(this._pose.theta + photocellConst.offsetAngle)) *
            photocellConst.offset
      )
    );
    const y = Math.floor(
      toPixel(
        this._pose.y +
          Math.sin(toRadian(this._pose.theta + photocellConst.offsetAngle)) *
            photocellConst.offset
      )
    );
    return this.#isDarkAtPosition(x, y);
  }

  /**
   *
   * @param {number} power (-10...10)
   * @param {number} lenkung (-10...10)
   */
  antrieb(power, lenkung) {
    this.#stopCalculation();
    if (power === 0) {
      return;
    }
    let vR;
    let vL;
    if (lenkung < 0) {
      // Linksdrehung
      vL = this.#translateToSpeed(power + ((2 * power) / 10) * lenkung);
      vR = this.#translateToSpeed(power);
    } else if (lenkung > 0) {
      // Rechtsdrehung
      vL = this.#translateToSpeed(power);
      vR = this.#translateToSpeed(power - ((2 * power) / 10) * lenkung);
    } else {
      vR = vL = this.#translateToSpeed(power);
    }
    this.#startPermanentCalculation(vL, vR);
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
   * @param {number} power motor
   * @return {number} m/s
   */
  #translateToSpeed(power) {
    return power / 40;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {0|1}
   */
  #isDarkAtPosition(x, y) {
    const index = 4 * (y * stageWidth + x);
    return this._backgroundImageData[index] > 0 ? 1 : 0; //TODO hell oder dunkel?
  }
}
