import InputMapper from "@/compositions/makeCodeMapper/InputMapper";

export default class InputSimulator extends InputMapper {
  constructor(startTime, pose) {
    super();
    this._startTime = startTime;
    this._pose = pose;
  }

  /**
   * Kompassausrichtung (°)
   * @return {number}
   */
  compassHeading() {
    return (this.pose.theta + 90) % 360;
  }

  /**
   * Laufzeit (ms)
   * @return {number}
   */
  runningTime() {
    return Date.now() - this._startTime;
  }

  /**
   * Laufzeit (micros)
   * @return {number}
   */
  runningTimeMicros() {
    return this.runningTime() / 1000;
  }

  /**
   * Kompass kalibrieren
   */
  calibrateCompass() {
    // nothing to do
  }
}
