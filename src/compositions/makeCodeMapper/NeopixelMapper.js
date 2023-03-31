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
        this.unused("NeopixelMapper.setzeStrip", pin, numLeds, mode);
        return new Strip();
    }

    /**
     * HSL-Farbe: Farbwert, Sättigung, Helligkeit
     * @param h
     * @param s
     * @param l
     */
    hsl(h, s, l) {
        this.notSupported("NeopixelMapper.HSL-Farbe", h, s, l);
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
        this.notSupported("NeopixelMapper.rgb", red, green, blue);
    }

}

class Strip extends Mapper {

    constructor() {
        super();
    }

    /**
     * setze range auf strip
     * @param start number
     * @param length number
     */
    range(start, length) {
        this.unused("NeopixelMapper.setzeRangeAuf", start, length);
    }

    /**
     * zeige Regenbogenfarben von Farbton bis
     * @param startHue number
     * @param endHue number
     */
    showRainbow(startHue, endHue) {
        this.notSupported("NeopixelMapper.zeigeRegenbogenfarben", startHue, endHue);
    }

    /**
     * zeige Farbe
     * @param rgb number
     */
    showColor(rgb) {
        // TODO
        console.log("show Color", rgb)
    }

    /**
     * zeige Balkendiagramm von Wert mit Maximum
     * @param value
     * @param high
     */
    showBarGraph(value, high) {
        this.notSupported("NeopixelMapper.zeigeBalkendiagramm", value, high);
    }

    /**
     * strip anzeigen
     */
    show() {
        this.notSupported("NeopixelMapper.anzeigen");
    }

    /**
     * strip ausschalten
     */
    clear() {
        this.notSupported("NeopixelMapper.ausschalten");
    }

    /**
     * verschiebe NeoPixel um
     * @param offset
     */
    shift(offset) {
        this.notSupported("NeopixelMapper.verschiebeNeopixel", offset);
    }

    /**
     * rotiere NeoPixel um
     * @param offset
     */
    rotate(offset) {
        this.notSupported("NeopixelMapper.rotiereNeopixel", offset);
    }

    /**
     * setze weiße LED von NeoPixel
     * @param pixelOffset number
     * @param white number
     */
    setPixelWhiteLED(pixelOffset, white) {
        this.notSupported("NeopixelMapper.setzeWeißeLedVonNeopixel", pixelOffset, white);
    }

    /**
     * setze Farbe von NeoPixel auf
     * @param pixelOffset number
     * @param rgb number
     */
    setPixelColor(pixelOffset, rgb) {
        this.notSupported("NeopixelMapper.setzeFarbevonNeopixel", pixelOffset, rgb);
    }

    /**
     * strip Länge
     */
    length() {
        this.notSupported("NeopixelMapper.länge");
    }

    /**
     * setze Helligkeit
     * @param brightness number
     */
    setBrightness(brightness) {
        this.notSupported("NeopixelMapper.setzeHelligkeit", brightness);
    }

    /**
     * abdunkeln
     */
    easeBrightness() {
        this.notSupported("NeopixelMapper.abdunkeln");
    }

    /**
     * Stromverbrauch (mA)
     */
    power() {
        this.notSupported("NeopixelMapper.stromverbrauch");
    }

    /**
     * setze Matrix Breite
     * @param width number
     */
    setMatrixWidth(width) {
        this.notSupported("NeopixelMapper.setzeMatrixBreite", width);
    }

    /**
     * setze Matrix Farbe an Position auf
     * @param x number
     * @param y number
     * @param rgb number
     */
    setMatrixColor(x, y, rgb) {
        this.notSupported("NeopixelMapper.setzeMatrixFarbeAnPosition", x, y, rgb);
    }
}