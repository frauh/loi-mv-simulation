import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import { calculateNewPose } from "@/compositions/simulation/KinematicModel";
import {
  deltaT,
  photocellConst,
  toPixel,
  toRadian,
  vehicleConst,
} from "@/compositions/Consts";
import LoiMvMapper from "@/compositions/makeCodeMapper/LoiMvMapper";
import {
  DigitalPin,
  PingUnit,
} from "@/compositions/simulation/SimulationWorker";

export default class LoiMvSimulator extends LoiMvMapper {
  constructor(pose, backgroundImageData, sonar) {
    super();
    this._pose = pose;
    this._backgroundImageData = backgroundImageData;
    this._calculationInterval = null;
    this._sonar = sonar;
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
    toleranz = 4 * v;
    let target = (this._pose.theta + drehung + 360) % 360;
    let difference = Math.abs(target - this._pose.theta);
    if (drehung < 0) {
      // Linksdrehung
      this.commit(WorkerMessageKey.intervalCalculating, true);
      this._calculationInterval = setInterval(() => {
        if (Math.min(difference, 360 + difference) > toleranz) {
          this.#singleCalculation(-v, v);
          difference = Math.abs(target - this._pose.theta);
        } else {
          this.#stopCalculation();
        }
        console.log(difference);
      }, deltaT * 1000);
    } else {
      // Rechtsdrehung
      this.commit(WorkerMessageKey.intervalCalculating, true);
      this._calculationInterval = setInterval(() => {
        if (Math.min(difference, 360 - difference) > toleranz) {
          this.#singleCalculation(v, -v);
          difference = Math.abs(target - this._pose.theta);
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
    return this.#isDarkAtPosition(
      this.#calculatePhotocellPosition(
        this._pose.theta - photocellConst.offsetAngle
      )
    );
  }

  /**
   *
   * @return {0|1}
   */
  helligkeitRechts() {
    return this.#isDarkAtPosition(
      this.#calculatePhotocellPosition(
        this._pose.theta + photocellConst.offsetAngle
      )
    );
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

  /**
   *
   * @returns {number}
   */
  ultraschall() {
    return this._sonar.ping(DigitalPin.P8, DigitalPin.P9, PingUnit.Centimeters);
  }

  #startPermanentCalculation(vL, vR) {
    this.commit(WorkerMessageKey.intervalCalculating, true);
    this._calculationInterval = setInterval(() => {
      this.#singleCalculation(vL, vR);
    }, deltaT * 1000);
  }

  #singleCalculation(vL, vR) {
    this._pose = calculateNewPose(
      this._pose.x,
      this._pose.y,
      this._pose.theta,
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
   * @param {number} power motor (1...10)
   * @return {number} m/s
   */
  #translateToSpeed(power) {
    return (vehicleConst.maxSpeed / 10) * power;
  }

  #calculatePhotocellPosition(angle) {
    const x = Math.floor(
      toPixel(this._pose.x + Math.cos(toRadian(angle)) * photocellConst.offset)
    );
    const y = Math.floor(
      toPixel(this._pose.y + Math.sin(toRadian(angle)) * photocellConst.offset)
    );
    return { x: x, y: y };
  }

  /**
   * Überprüft, ob an gegebener Position der Untergrund nicht weiß ist.
   * weiß = hell; !weiß = dunkel
   * @param {{x: number, y: number}} zu überprüfende Position
   * @return {0|1} 0 = hell, 1 = dunkel
   */
  #isDarkAtPosition({ x, y }) {
    const index = 4 * (y * this._backgroundImageData.width + x);
    return this._backgroundImageData.data[index] > 0 ? 0 : 1;
  }
}
