import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LCD1602_I2C' für micro:bit V1
 * vgl. https://github.com/makecode-extensions/i2cLCD1602
 */
export default class I2cLcdMapper extends Simulator {
  /**
   * LCD initialize with Address
   * @param {number} addr
   */
  LcdInit(addr) {
    this.notSupported("LCD1602_I2C.LcdInitializeWithAddress", addr);
  }

  /**
   * show string at
   * @param {String} s
   * @param {number} x
   * @param {number} y
   */
  ShowString(s, x, y) {
    this.notSupported("LCD1602_I2C.showStringAt", s, x, y);
  }

  /**
   * show number at
   * @param {number} n number
   * @param {number} x number
   * @param {number} y number
   */
  ShowNumber(n, x, y) {
    this.notSupported("LCD1602_I2C.showNumberAt", n, x, y);
  }

  /**
   * clear LCD
   */
  clear() {
    this.notSupported("LCD1602_I2C.Clear");
  }

  /**
   * turn on LCD
   */
  on() {
    this.notSupported("LCD1602_I2C.turnOnLcd");
  }

  /**
   * turn off OCD
   */
  off() {
    this.notSupported("LCD1602_I2C.turnOffLcd");
  }

  /**
   * turn on backlight
   */
  BacklightOn() {
    this.notSupported("LCD1602_I2C.turnOnBacklight");
  }

  /**
   * turn off backlight
   */
  BacklightOff() {
    this.notSupported("LCD1602_I2C.turnOffBacklight");
  }

  /**
   * shift left
   */
  shl() {
    this.notSupported("LCD1602_I2C.shiftLeft");
  }

  /**
   * shift right
   */
  shr() {
    this.notSupported("LCD1602_I2C.shiftRight");
  }
}
