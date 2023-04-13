import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import BasicMapper from "@/compositions/makeCodeMapper/BasicMapper";
import { ArrowNames } from "@/compositions/simulation/SimulationWorker";

export default class BasicSimulator extends BasicMapper {
  constructor(vehicleColor, vehicleLabel) {
    super();
    this._vehicleColor = vehicleColor;
    this._vehicleLabel = vehicleLabel;
  }

  /**
   * zeige Zahl
   * @param {number} value
   */
  showNumber(value) {
    this.#showLEDs(value);
  }

  /**
   * zeige LEDs
   * @param {String} leds
   */
  showLeds(leds) {
    this.#showLEDs(leds);
  }

  /**
   * zeige Symbol
   * @param {number} icon
   * @see IconNames
   */
  showIcon(icon) {
    this.#showLEDs(this.#mapIconNames(icon));
  }

  /**
   * zeige Text
   * @param {String} text
   */
  showString(text) {
    this.#showLEDs(text);
  }

  /**
   * Bildschirminhalt löschen
   */
  clearScreen() {
    // nothing to do
  }

  /**
   * pausiere (ms)
   * Dieser Fall wird im Parser abgefangen
   * @param {number} ms
   */
  // eslint-disable-next-line no-unused-vars
  pause(ms) {
    // nothing to do
  }

  /**
   * zeige Pfeil
   * @param {number} direction
   * @see ArrowNames
   */
  showArrow(direction) {
    this.#showLEDs(this.#mapArrowName(direction));
  }

  /**
   * Gibt den Namen des Fahrzeugs zusammen mit der Nachricht zur Darstellung in der LogArea aus
   * @param {String|number} msg String
   */
  #showLEDs(msg) {
    let style =
      "<p style='font-size:14px; padding-left: 3px; padding-right: 3px;'>";
    let label = "".concat(
      "<b style='color:",
      this._vehicleColor,
      "'>",
      this._vehicleLabel,
      ": </b>"
    );
    this.commit(WorkerMessageKey.outputLog, style.concat(label, msg, "</p>"));
  }

  /**
   *
   * @param {number} iconName
   * @returns {string}
   */
  #mapIconNames(iconName) {
    switch (iconName) {
      case 0: // "Heart"
      case 1: // "SmallHeart"
        return "<i class='fas fa-heart'></i>";
      case 2: // "Yes"
        return "<i class='fas fa-check'></i>";
      case 3: // "No"
        return "<i class='fas fa-xmark'></i>";
      case 4: // "Happy"
        return "<i class='fas fa-face-smile'></i>";
      case 5: // "Sad"
        return "<i class='fas fa-face-frown'></i>";
      case 6: // "Confused"
        return "<i class='fas fa-face-grimace'></i>";
      case 7: // "Angry"
        return "<i class='fas fa-face-angry'></i>";
      case 8: // "Asleep"
        return "<i class='fas fa-face-meh-blank'></i>";
      case 9: // "Surprised"
        return "<i class='fas fa-face-surprise'></i>";
      case 10: // "Silly"
        return "<i class='fas fa-face-sad-tear'></i>";
      case 11: // "Fabulous"
        return "<i class='fas fa-face-grin-stars'></i>";
      case 12: // "Meh"
        return "<i class='fas fa-face-meh'></i>";
      case 13: // "TShirt"
        return "<i class='fas fa-shirt'></i>";
      case 16: // "House"
        return "<i class='fas fa-house'></i>";
      case 19: // "StickFigure":
        return "<i class='fas fa-child-reaching'></i>";
      case 20: // "Ghost"
        return "<i class='fas fa-ghost'></i>";
      case 23: // "Skull"
        return "<i class='fas fa-skull'></i>";
      case 24: // "Umbrella"
        return "<i class='fas fa-umbrella'></i>";
      case 27: // "Cow"
        return "<i class='fas fa-cow'></i>";
      case 28: // "QuarterNote"
      case 29: // "EigthNote"
        return "<i class='fas fa-music'></i>";
      case 30: // "Pitchfork"
        return "<i class='fas fa-y'></i>";
      case 31: // "Target"
        return "<i class='fas fa-circle-dot'></i>";
      case 32: // "Triangle"
      case 33: // "LeftTriangle"
        return "<i class='fas fa-caret-left'></i>";
      case 34: // "Chessboard"
        return "<i class='fas fa-chess-board'></i>";
      case 35: // "Diamond"
      case 36: // "SmallDiamond"
        return "<i class='fas fa-diamond'></i>";
      case 37: // "Square"
      case 38: // "SmallSquare"
        return "<i class='fas fa-square'></i>";
      case 39: // "Scissors"
        return "<i class='fas fa-scissors'></i>";
      default:
        return "Icon: " + iconName;
    }
  }

  /**
   *
   * @param {number} arrowName
   * @returns {string}
   */
  #mapArrowName(arrowName) {
    switch (arrowName) {
      case 0: // "North"
        return "<i class='fas fa-arrow-up'></i>";
      case 1: // "NorthEast"
        return [
          this.#mapArrowName(ArrowNames.North),
          this.#mapArrowName(ArrowNames.East),
        ].join();
      case 2: // "East"
        return "<i class='fas fa-arrow-right'></i>";
      case 3: // "SouthEast"
        return [
          this.#mapArrowName(ArrowNames.South),
          this.#mapArrowName(ArrowNames.East),
        ].join();
      case 4: // "South"
        return "<i class='fas fa-arrow-down'></i>";
      case 5: // "SouthWest"
        return [
          this.#mapArrowName(ArrowNames.South),
          this.#mapArrowName(ArrowNames.West),
        ].join();
      case 6: // "West"
        return "<i class='fas fa-arrow-left'></i>";
      case 7: // "NorthWest"
        return [
          this.#mapArrowName(ArrowNames.North),
          this.#mapArrowName(ArrowNames.West),
        ].join();
      default:
        return "Pfeil " + arrowName;
    }
  }
}
