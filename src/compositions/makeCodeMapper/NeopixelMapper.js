import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'NeopixelMapper' für micro:bit V1
 * vgl. https://github.com/microsoft/pxt-neopixel/blob/master/neopixel.ts
 */
export default class NeopixelMapper extends Mapper {
  /**
   * setze Strip auf
   * @param pin DigitalPin
   * @param numLeds number
   * @param mode NeoPixelMode
   */
  create(pin, numLeds, mode) {
    this.unused("Neopixel.setzeStrip", pin, numLeds, mode);
    return new Strip(this._simulator);
  }

  /**
   * HSL-Farbe: Farbwert, Sättigung, Helligkeit
   * @param h
   * @param s
   * @param l
   */
  hsl(h, s, l) {
    return "hsl(".concat(h, ",", s, "%,", l, "%)");
  }

  /**
   * Farbe
   * @param color NeoPixelColors
   */
  colors(color) {
    return color;
  }

  /**
   * rot grün blau
   * @param red number
   * @param green number
   * @param blue number
   */
  rgb(red, green, blue) {
    return "rgb(".concat(red, ",", green, ",", blue, ")");
  }
}

class Strip extends Mapper {
  /**
   * setze range auf strip
   * @param start number
   * @param length number
   */
  range(start, length) {
    this.unused("Neopixel.setzeRangeAuf", start, length);
    // nothing to do
    return "";
  }

  /**
   * zeige Regenbogenfarben von Farbton bis
   * @param startHue number
   * @param endHue number
   */
  showRainbow(startHue, endHue) {
    this.unused("Neopixel.zeigeRegenbogenfarben", startHue, endHue);
    this._simulator.turnOn("rainbow");
  }

  /**
   * zeige Farbe
   * @param rgb number
   */
  showColor(rgb) {
    this._simulator.turnOn(rgb);
  }

  /**
   * zeige Balkendiagramm von Wert mit Maximum
   * @param value
   * @param high
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
    this._simulator.turnOff();
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
   * @param offset
   */
  rotate(offset) {
    this.notSupported("Neopixel.rotiereNeopixel", offset);
  }

  /**
   * setze weiße LED von NeoPixel
   * @param pixelOffset number
   * @param white number
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
   * @param width number
   */
  setMatrixWidth(width) {
    this.notSupported("Neopixel.setzeMatrixBreite", width);
  }

  /**
   * setze Matrix Farbe an Position auf
   * @param x number
   * @param y number
   * @param rgb number
   */
  setMatrixColor(x, y, rgb) {
    this.notSupported("Neopixel.setzeMatrixFarbeAnPosition", x, y, rgb);
  }
}
