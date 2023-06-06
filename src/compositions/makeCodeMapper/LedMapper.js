import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LED' für micro:bit V1
 */
export default class LedMapper extends Simulator {
  /**
   * Zeichne
   * @param {number} x
   * @param {number} y
   */
  plot(x, y) {
    this.notSupported("LED.zeichne", x, y);
  }

  /**
   * schalte um
   * @param {number} x
   * @param {number} y
   */
  toggle(x, y) {
    this.notSupported("LED.schalteUm", x, y);
  }

  /**
   * lösche
   * @param {number} x
   * @param {number} y
   */
  unplot(x, y) {
    this.notSupported("LED.löschen", x, y);
  }

  /**
   * Punkt
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  point(x, y) {
    this.notSupported("LED.Punkt", x, y);
    return false;
  }

  /**
   * zeichne Säulendiagramm von bis
   * @param {number} value
   * @param {number} high
   */
  plotBarGraph(value, high) {
    this.notSupported("LED.zeichneSäulendiagramm", value, high);
  }

  /**
   * Zeichne mit Helligkeit
   * @param {number} x
   * @param {number} y
   * @param {number} brightness
   */
  plotBrightness(x, y, brightness) {
    this.notSupported("LED.zeichne", x, y, brightness);
  }

  /**
   * Punkt Helligkeit
   * @param {number} x
   * @param {number} y
   * @return {number}
   */
  pointBrightness(x, y) {
    this.notSupported("LED.punkt", x, y);
    return 0;
  }

  /**
   * Helligkeit
   * @return {number}
   */
  brightness() {
    this.notSupported("LED.helligkeit");
    return 0;
  }

  /**
   * setze Helligkeit auf
   * @param value number
   */
  setBrightness(value) {
    this.notSupported("LED.setzeHelligkeitAuf", value);
  }

  /**
   * LED aktivieren
   * @param on boolean
   */
  enable(on) {
    this.notSupported("LED.ledAktivieren", on);
  }

  /**
   * Halte Animation an
   */
  stopAnimation() {
    this.notSupported("LED.halteAnimationAn");
  }

  /**
   * setze Anzeigemodus
   * @param mode DisplayMode
   */
  setDisplayMode(mode) {
    this.notSupported("LED.setzeAnzeigemodus", mode);
  }
}
