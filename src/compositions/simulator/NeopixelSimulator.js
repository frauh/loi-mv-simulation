import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import NeopixelMapper, {
  StripMapper,
} from "@/compositions/makeCodeMapper/NeopixelMapper";

export default class NeopixelSimulator extends NeopixelMapper {
  /**
   * setze Strip auf
   * @param {DigitalPin} pin
   * @param {number} numLeds
   * @param {NeoPixelMode} mode
   * @return {Strip}
   */
  // eslint-disable-next-line no-unused-vars
  create(pin, numLeds, mode) {
    return new Strip();
  }

  /**
   * HSL-Farbe: Farbwert, Sättigung, Helligkeit
   * @param {number} h
   * @param {number} s
   * @param {number} l
   * @return {String}
   */
  hsl(h, s, l) {
    return "hsl(".concat(
      h.toString(),
      ",",
      s.toString(),
      "%,",
      l.toString(),
      "%)"
    );
  }

  /**
   * Farbe
   * @param {NeoPixelColors} color
   * @return {NeoPixelColors}
   */
  colors(color) {
    return color;
  }

  /**
   * rot grün blau
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @return {String}
   */
  rgb(red, green, blue) {
    return "rgb(".concat(
      red.toString(),
      ",",
      green.toString(),
      ",",
      blue.toString(),
      ")"
    );
  }
}

export class Strip extends StripMapper {
  /**
   * setze range auf strip
   * @param {number} start
   * @param {number} length
   * @return {Strip}
   */
  // eslint-disable-next-line no-unused-vars
  range(start, length) {
    // nothing to do
    return this;
  }

  /**
   * zeige Regenbogenfarben von Farbton bis
   * @param {number} startHue
   * @param {number} endHue
   */
  // eslint-disable-next-line no-unused-vars
  showRainbow(startHue, endHue) {
    this.commit(WorkerMessageKey.neoPixelColor, "rainbow");
  }

  /**
   * zeige Farbe
   * @param {String} rgb
   */
  showColor(rgb) {
    this.commit(WorkerMessageKey.neoPixelColor, rgb);
  }

  /**
   * strip ausschalten
   */
  clear() {
    this.commit(WorkerMessageKey.neoPixelColor, "");
  }
}
