import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LOI_MV' für micro:bit V1
 * vgl. https://github.com/eschaetz/loi-mv-sek1
 */
export default class LoiMvMapper extends Simulator {
  /**
   *
   * @param {boolean} kompass
   */
  init(kompass) {
    this.notSupported("LOI_MV.init", kompass.toString());
  }

  /**
   *
   * @param {number} drehung
   * @param {number} toleranz
   */
  graddrehung(drehung, toleranz) {
    this.notSupported("LOI_MV.graddrehung", toleranz);
  }

  /**
   *
   * @return {0|1}
   */
  helligkeitLinks() {
    this.notSupported("LOI_MV.helligkeitLinks");
    return 0;
  }

  /**
   *
   * @return {0|1}
   */
  helligkeitRechts() {
    this.notSupported("LOI_MV.helligkeitRechts");
    return 0;
  }

  /**
   *
   * @param {number} power (-10...10)
   * @param {number} lenkung (-10...10)
   */
  antrieb(power, lenkung) {
    this.notSupported("LOI_MV.antrieb", power, lenkung);
  }

  ultraschall() {
    this.notSupported("LOI_MV.ultraschall");
    return 0;
  }
}
