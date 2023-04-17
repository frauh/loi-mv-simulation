import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Eingabe' für micro:bit V1
 */
export default class InputMapper extends Simulator {
  /**
   * Wenn Knopf geklickt
   * Entrypoint vgl. Parser
   * @param {Button} button
   * @param {function} handler
   */
  onButtonPressed(button, handler) {
    this.notSupported(
      "Eingabe.wennKnopfGeklickt",
      button.toString(),
      handler.toString()
    );
  }

  /**
   * Wenn micro:bit bewegt wird
   * Entrypoint vgl. Parser
   * @param {Gesture} gesture
   * @param {function} handler
   */
  onGesture(gesture, handler) {
    this.notSupported(
      "Eingabe.wennBewegt",
      gesture.toString(),
      handler.toString()
    );
  }

  /**
   * Wenn Pin gedrückt
   * Entrypoint vgl. Parser
   * @param {TouchPin} name
   * @param {function} handler
   */
  onPinPressed(name, handler) {
    this.notSupported(
      "Eingabe.wennPinGedrückt",
      name.toString(),
      handler.toString()
    );
  }

  /**
   * Wenn Pin losgelassen
   * Entrypoint vgl. Parser
   * @param {TouchPin} name
   * @param {function} handler
   */
  onPinReleased(name, handler) {
    this.notSupported(
      "Eingabe.wennPinLosgelassen",
      name.toString(),
      handler.toString()
    );
  }

  /**
   * Knopf ist geklickt
   * @param {Button} button
   * @return {boolean}
   */
  buttonIsPressed(button) {
    this.notSupported("Eingabe.knopfIstGeklickt", button.toString());
    return false;
  }

  /**
   * Beschleunigung (mg)
   * @param {Dimension} dimension
   * @return {number}
   */
  acceleration(dimension) {
    this.notSupported("Eingabe.beschleunigung", dimension.toString());
    return 0;
  }

  /**
   * Pin ist gedrückt
   * @param {TouchPin} name
   * @return {boolean}
   */
  pinIsPressed(name) {
    this.notSupported("Eingabe.pinIstGedrückt", name.toString());
    return false;
  }

  /**
   * Lichtstärke
   * @return {number}
   */
  lightLevel() {
    this.notSupported("Eingabe.lichtstärke");
    return 0;
  }

  /**
   * Kompassausrichtung (°)
   * @return {number}
   */
  compassHeading() {
    this.notSupported("Eingabe.kompassausrichtung");
    return 0;
  }

  /**
   * Temperatur (C°)
   * @return {number}
   */
  temperature() {
    this.notSupported("Eingabe.temperatur");
    return 0;
  }

  /**
   * Bewegung
   * @param {Gesture} gesture
   * @return {boolean}
   */
  isGesture(gesture) {
    this.notSupported("Eingabe.bewegung", gesture.toString());
    return false;
  }

  /**
   * Rotation (°)
   * @param {Rotation} kind
   * @return {number}
   */
  rotation(kind) {
    this.notSupported("Eingabe.rotation", kind.toString());
    return 0;
  }

  /**
   * Magnetkraft (µT)
   * @param {Dimension} dimension
   * @return {number}
   */
  magneticForce(dimension) {
    this.notSupported("Eingabe.magnetkraft", dimension.toString());
    return 0;
  }

  /**
   * Laufzeit (ms)
   * @return {number}
   */
  runningTime() {
    this.notSupported("Eingabe.laufzeit");
    return 0;
  }

  /**
   * Laufzeit (micros)
   * @return {number}
   */
  runningTimeMicros() {
    this.notSupported("Eingabe.laufzeit");
    return 0;
  }

  /**
   * Kompass kalibrieren
   */
  calibrateCompass() {
    this.notSupported("Eingabe.kompassKalibrieren");
  }

  /**
   * setze Bewegungsmesser auf
   * @param {AcceleratorRange} range
   */
  setAccelerometerRange(range) {
    this.notSupported("Eingabe.setzeBewegungsmesser", range.toString());
  }
}
