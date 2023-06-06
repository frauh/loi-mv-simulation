import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Grundlagen' für micro:bit V1
 * 'Beim Start' wird nicht beachtet, da dieses ohnehin immer zuerst ausgeführt wird
 */
export default class BasicMapper extends Simulator {
  /**
   * dauerhaft
   * Entrypoint vgl. Parser
   * @param {function} handler
   */
  forever(handler) {
    this.notSupported("Grundlagen.dauerhaft", handler.toString());
  }

  /**
   * zeige Zahl
   * @param {number} value
   */
  showNumber(value) {
    this.notSupported("Grundlagen.zeigeZahl", value);
  }

  /**
   * zeige LEDs
   * @param {String} leds
   */
  showLeds(leds) {
    this.notSupported("Grundlagen.zeigeLEDs", leds);
  }

  /**
   * zeige Symbol
   * @param {number} icon
   * @see IconNames
   */
  showIcon(icon) {
    this.notSupported("Grundlagen.zeigeSymbol", icon.toString());
  }

  /**
   * zeige Text
   * @param {String} text
   */
  showString(text) {
    this.notSupported("Grundlagen.zeigeText", text);
  }

  /**
   * Bildschirminhalt löschen
   */
  clearScreen() {
    this.notSupported("Grundlagen.BildschirminhaltLöschen");
  }

  /**
   * pausiere (ms)
   * @param {number} ms
   */
  pause(ms) {
    this.notSupported("Grundlagen.pausiere", ms);
  }

  /**
   * zeige Pfeil
   * @param {number} direction
   * @see ArrowNames
   */
  showArrow(direction) {
    this.notSupported("Grundlagen.zeigePfeil", direction);
  }
}
