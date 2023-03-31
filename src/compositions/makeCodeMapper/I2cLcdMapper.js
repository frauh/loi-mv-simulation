import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LCD1602_I2C' für micro:bit V1
 */
export default class I2cLcdMapper extends Mapper {

    /**
     * LCD initialize with Address
     * @param addr number
     */
    LcdInit(addr) {
        this.unused("I2cLcdMapper.lcdInitializeWithAddress", addr);
        // nothing to do
    }

    /**
     * show string at
     * @param s string
     * @param x number
     * @param y number
     */
    ShowString(s, x, y) {
        this._simulator.simulateLCD(s, x, y);
    }

    /**
     * show number at
     * @param n number
     * @param x number
     * @param y number
     */
    ShowNumber(n, x, y) {
        this._simulator.simulateLCD(n.toString(), x, y);
    }

    /**
     * clear LCD
     */
    clear() {
        this._simulator.simulateClearLcd();
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


}