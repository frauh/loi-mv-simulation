import MakeCodeMapper from "@/compositions/makeCodeMapper/MakeCodeMapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LCD1602_I2C' für micro:bit V1
 */
export default class I2cLcd extends MakeCodeMapper {

    _display = ["", ""];

    /**
     * LCD initialize with Address
     * @param addr number
     */
    LcdInit(addr) {
        this.unused(addr)
        // nothing to do
    }

    /**
     * show string at
     * @param s string
     * @param x number
     * @param y number
     */
    ShowString(s, x, y) {
        this.#simulateLCD(s, x, y);
    }

    /**
     * show number at
     * @param n number
     * @param x number
     * @param y number
     */
    ShowNumber(n, x, y) {
        this.#simulateLCD(n.toString(), x, y);
    }

    /**
     * clear LCD
     */
    clear() {
        // nothing to do
    }

    /**
     * turn on LCD
     */
    on() {
        // nothing to do
    }

    /**
     * turn off OCD
     */
    off() {
        // nothing to do
    }

    /**
     * turn on backlight
     */
    BacklightOn() {
        // nothing to do
    }

    /**
     * turn off backlight
     */
    BacklightOff() {
        // nothing to do
    }

    /**
     * shift left
     */
    shl() {
        this.notSupported("LCD1602_I2C.shiftLeft")
    }

    /**
     * shift right
     */
    shr() {
        this.notSupported("LCD1602_I2C.shiftRight")
    }

    #simulateLCD(value, x, y) {
        this._display[y] = [this._display[y].slice(0, x), value].join("")
        //TODO log
        console.log(this._display.join("\n"));
    }

}