import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import I2cLcdMapper from "@/compositions/makeCodeMapper/I2cLcdMapper";

export default class I2cLcdSimulator extends I2cLcdMapper {
  constructor(vehicleColor, vehicleLabel) {
    super();
    this._vehicleColor = vehicleColor;
    this._vehicleLabel = vehicleLabel;
    this._display = ["", ""];
  }

  /**
   * LCD initialize with Address
   * @param {number} addr
   */
  // eslint-disable-next-line no-unused-vars
  LcdInit(addr) {
    // nothing to do
  }

  /**
   * show string at
   * @param {String} s
   * @param {number} x
   * @param {number} y
   */
  ShowString(s, x, y) {
    this.#simulateLcd(s, x, y);
  }

  /**
   * show number at
   * @param {number} n number
   * @param {number} x number
   * @param {number} y number
   */
  ShowNumber(n, x, y) {
    this.#simulateLcd(n.toString(), x, y);
  }

  /**
   * clear LCD
   */
  clear() {
    this._display = ["", ""];
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
   * gibt den Namen des Fahrzeugs zusammen mit der Nachricht aus
   * @param {String} value String Nachricht
   * @param {number} x Number Spalte auf dem Display (0-15)
   * @param {number} y Number Zeile auf dem Display (0-1)
   */
  #simulateLcd(value, x, y) {
    this._display[y] = this.#addToLine(this._display[y], value, x);
    let style =
      "<p style='font-size:14px; padding-left: 3px; padding-right: 3px;'>";
    let label = "".concat(
      "<b style='color:",
      this._vehicleColor,
      "'>",
      this._vehicleLabel,
      ": </b><br/>"
    );
    this.commit(
      WorkerMessageKey.outputLog,
      style.concat(label, this._display.join("<br/>"), "</p>")
    );
  }

  #addToLine(line, value, position) {
    if (!line || line.length < position) {
      return this.#insertOutsideOfCurrent(line, value, position);
    }
    let before = line.slice(0, position);
    let after = line.slice(position + value.length);
    return before.concat(value, after);
  }

  #insertOutsideOfCurrent(line, value, position) {
    while (line.length < position) {
      line = line.concat(" ");
    }
    return line.concat(value);
  }
}
