import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LED' für micro:bit V1
 */
export default class LedMapper extends Mapper {
    /**
     * Zeichne
     * @param x number
     * @param y number
     */
    plot(x, y) {
        this.notSupported("LED.zeichne", x, y);
    }

    /**
     * schalte um
     * @param x number
     * @param y number
     */
    toggle(x, y) {
        this.notSupported("LED.schalteUm", x, y);
    }

    /**
     * lösche
     * @param x number
     * @param y number
     */
    unplot(x, y) {
        this.notSupported("LED.löschen", x, y);
    }

    /**
     * Punkt
     * @param x number
     * @param y number
     */
    point(x, y) {
        this.notSupported("LED.Punkt", x, y);
    }

    /**
     * zeichne Säulendiagramm von bis
     * @param value number
     * @param high number
     */
    plotBarGraph(value, high) {
        this.notSupported("LED.zeichneSäulendiagramm", value, high);
    }

    /**
     * Zeichne mit Helligkeit
     * @param x number
     * @param y number
     * @param brightness number
     */
    plotBrightness(x, y, brightness) {
        this.notSupported("LED.zeichne", x, y, brightness);
    }

    /**
     * Punkt Helligkeit
     * @param x number
     * @param y number
     */
    pointBrightness(x, y) {
        this.notSupported("LED.punkt", x, y);
    }

    /**
     * Helligkeit
     */
    brightness() {
        this.notSupported("LED.helligkeit");
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
