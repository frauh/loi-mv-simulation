import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Sonar' für micro:bit V1
 * vgl. https://github.com/microsoft/pxt-sonar
 */
export default class SonarMapper extends Simulator {
  /**
   * ping
   * @param {DigitalPin} trig
   * @param {DigitalPin} echo
   * @param {PingUnit} unit
   * @return {number}
   */
  ping(trig, echo, unit) {
    this.notSupported(
      "Sonar.ping",
      trig.toString(),
      echo.toString(),
      unit.toString()
    );
    return 0;
  }
}
