import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'NeopixelMapper' für micro:bit V1
 * vgl. https://github.com/microsoft/pxt-neopixel/blob/master/neopixel.ts
 */
export default class NeopixelMapper extends Simulator {
  /**
   * setze Strip auf
   * @param {DigitalPin} pin
   * @param {number} numLeds
   * @param {NeoPixelMode} mode
   * @return {StripMapper}
   */
  create(pin, numLeds, mode) {
    this.notSupported(
      "Neopixel.setzeStrip",
      pin.toString(),
      numLeds,
      mode.toString()
    );
    return null;
  }

  /**
   * HSL-Farbe: Farbwert, Sättigung, Helligkeit
   * @param {number} h
   * @param {number} s
   * @param {number} l
   * @return {number}
   */
  hsl(h, s, l) {
    this.notSupported("Neopixel.hsl-farbe", h, s, l);
    return 0;
  }

  /**
   * Farbe
   * @param {NeoPixelColors} color
   * @return {number}
   */
  colors(color) {
    this.notSupported("Neopixel.Farbe", color.toString());
    return 0;
  }

  /**
   * rot grün blau
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @return {number}
   */
  rgb(red, green, blue) {
    this.notSupported("Neopixel.hsl-farbe", red, green, blue);
    return 0;
  }
}

export class StripMapper extends Simulator {
  /**
   * setze range auf strip
   * @param {number} start
   * @param {number} length
   * @return StripMapper
   */
  range(start, length) {
    this.notSupported("Neopixel.setzeRangeAuf", start, length);
    return null;
  }

  /**
   * zeige Regenbogenfarben von Farbton bis
   * @param {number} startHue
   * @param {number} endHue
   */
  showRainbow(startHue, endHue) {
    this.notSupported("Neopixel.zeigeRegenbogenfarben", startHue, endHue);
  }

  /**
   * zeige Farbe
   * @param {number} rgb
   */
  showColor(rgb) {
    this.notSupported("Neopixel.zeigeFarbe", rgb);
  }

  /**
   * zeige Balkendiagramm von Wert mit Maximum
   * @param {number} value
   * @param {number} high
   */
  showBarGraph(value, high) {
    this.notSupported("Neopixel.zeigeBalkendiagramm", value, high);
  }

  /**
   * strip anzeigen
   */
  show() {
    this.notSupported("Neopixel.anzeigen");
  }

  /**
   * strip ausschalten
   */
  clear() {
    this.notSupported("Neopixel.ausschalten");
  }

  /**
   * verschiebe NeoPixel um
   * @param offset
   */
  shift(offset) {
    this.notSupported("Neopixel.verschiebeNeopixel", offset);
  }

  /**
   * rotiere NeoPixel um
   * @param {number} offset
   */
  rotate(offset) {
    this.notSupported("Neopixel.rotiereNeopixel", offset);
  }

  /**
   * setze weiße LED von NeoPixel
   * @param {number} pixelOffset
   * @param {number} white
   */
  setPixelWhiteLED(pixelOffset, white) {
    this.notSupported("Neopixel.setzeWeißeLedVonNeopixel", pixelOffset, white);
  }

  /**
   * setze Farbe von NeoPixel auf
   * @param pixelOffset number
   * @param rgb number
   */
  setPixelColor(pixelOffset, rgb) {
    this.notSupported("Neopixel.setzeFarbevonNeopixel", pixelOffset, rgb);
  }

  /**
   * strip Länge
   */
  length() {
    this.notSupported("Neopixel.länge");
  }

  /**
   * setze Helligkeit
   * @param brightness number
   */
  setBrightness(brightness) {
    this.notSupported("Neopixel.setzeHelligkeit", brightness);
  }

  /**
   * abdunkeln
   */
  easeBrightness() {
    this.notSupported("Neopixel.abdunkeln");
  }

  /**
   * Stromverbrauch (mA)
   */
  power() {
    this.notSupported("Neopixel.stromverbrauch");
  }

  /**
   * setze Matrix Breite
   * @param {number} width
   */
  setMatrixWidth(width) {
    this.notSupported("Neopixel.setzeMatrixBreite", width);
  }

  /**
   * setze Matrix Farbe an Position auf
   * @param {number} x
   * @param {number} y
   * @param {number} rgb
   */
  setMatrixColor(x, y, rgb) {
    this.notSupported("Neopixel.setzeMatrixFarbeAnPosition", x, y, rgb);
  }
}
