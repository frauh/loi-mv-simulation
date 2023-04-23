/**
 * Konstanten für die gesamte Anwendung
 */

/**
 * Breite des Simulationsbereichs
 * @type {number} Pixel
 */
export let stageWidth;

/**
 * Setzt die aktuelle Breite des Simulationsbereiches
 * @param {number} pixel
 */
export function setStageWidth(pixel) {
  stageWidth = pixel;
}

/**
 * Versatz, der bei allen sich wiederholenden Blöcken verwendet wird
 * als minimales Zeitintervall zwischen den Iterationen.
 * Der Start einer neuen Iteration ist unabhängig davon, ob die vorherige schon beendet worden ist.
 * Ggf. ist der Wert also anzupassen, wenn ein durchlauf länger dauert.
 * Beispiel:
 * @see BasicSimulator.forever
 * @see LoopsSimulator.everyInterval
 * @type {number} Millisekunden
 */
export const clock = 5;

/**
 * Berechnungsintervall der Kinematik
 * @type {number} Sekunden
 */
export const deltaT = 0.01;

export const backgroundConst = {
  /**
   * Länge eines DIN-A0 im Querformat
   * @type {number} Meter
   */
  a0Width: 1.189,

  /**
   * Höhe eines DIN-A0 im Querformat
   * @type {number} Meter
   */
  a0Height: 0.841,
};

export const vehicleConst = {
  /**
   * Länge des Roboters = Breite der 2D-Darstellung
   * @type {number} Meter
   */
  width: 0.245,

  /**
   * Breite des Roboters = Höhe der 2D-Darstellung
   * @type {number} Meter
   */
  height: 0.163,

  /**
   * Achslänge des Roboters
   * @type {number} Meter
   */
  b: 0.143,

  /**
   * Breite (Höhe in 2D) der Karosserie ohne Räder
   * @type {number} Meter
   */
  bodyHeight: 0.113,

  /**
   * Abstand des Vorderrades nach vorne
   * @type {number} Meter
   */
  wheelFrontDistance: 0.046,

  /**
   * Abstand des Hinterrades nach horne
   * @type {number} Meter
   */
  wheelRearDistance: 0.023,

  /**
   * Höchstgeschwindigkeit des Roboters
   * @type {number} Meter/Sekunde
   */
  maxSpeed: 0.3,

  /**
   * Abstand des Drehzentrum (Mittelpunkt der Achsen) vom Mittelpunkt des Roboters
   * @type {number} Meter
   */
  rotationOffset: 0.012,
};

export const ratioConst = {
  /**
   * Seitenverhältnis eines DIN-A Papiers und damit des Simulationsbereiches
   * @type {number}
   */
  background: backgroundConst.a0Width / backgroundConst.a0Height,

  /**
   * Größenrelation des Roboters im Vergleich zum DIN-A0 Blatt
   * @type {number}
   */
  vehicleToBackgroundWidth: vehicleConst.width / backgroundConst.a0Width,

  /**
   * Größenrelation des Roboters im Vergleich zum DIN-A0 Blatt
   * @type {number}
   */
  vehicleToBackgroundHeight: vehicleConst.height / backgroundConst.a0Height,
};

export const photocellConst = {
  /**
   * Abstand eines Hell-Dunkel-Sensors vom Mittelpunkt des Roboters (x-Achse)
   * @type {number} Meter
   */
  offset: vehicleConst.width / 2 - 0.017,

  /**
   * Winkel, über den berechnet wird (sin), wie weit der Hell-Dunkel-Sensor von der x-Achse entfernt ist => yOffset = 0.032
   * @type {number} Grad
   */
  offsetAngle: 18,
};

export const sonarConst = {
  /**
   * Entfernung des Ultraschallsensors vom Mittelpunkt des Roboters.
   * Ist nicht gleich der "Stoßstange".
   * @type {number} Meter
   */
  offset: vehicleConst.width / 2 - 0.02,

  /**
   * Winkel, der den Messbereich des Ultraschallsensors aufspannt
   * @type {number} Grad
   */
  measurementAngle: 15,

  /**
   * Warum auch immer gibt der Sensor weniger cm zurück als er sollte
   * @type {number} Factor
   */
  inaccuracy: 2 / 3,
};

export const neoPixelConst = {
  /**
   * Abstand des NeoPixel vom Mittelpunkt des Roboters
   * @type {number} Meter
   */
  offset: 0.071,

  /**
   * Radius des NeoPixel LED-Rings
   * @type {number} Meter
   */
  radius: 0.032 / 2,

  /**
   * Gradient, um den Regenbogeneffekt darzustellen
   * @type {(number|string)[]}
   */
  rainbow: [
    0,
    "purple",
    2 / 6,
    "blue",
    3 / 6,
    "green",
    4 / 6,
    "yellow",
    5 / 6,
    "orange",
    1,
    "red",
  ],
};

/**
 * zufällige Position in Abhängigkeit von der Größe des Simulationsbereichs
 * @return {{x: number, y: number}}
 */
export function randomPosition() {
  const stageHeight = stageWidth / ratioConst.background;
  return {
    x: stageWidth / 5 + (Math.random() * 3 * stageWidth) / 5,
    y: stageHeight / 5 + (Math.random() * 3 * stageHeight) / 5,
  };
}

/**
 * Winkelumrechnung
 * @param degree Grad
 * @return {number} Radiant
 */
export function toRadian(degree) {
  return degree * (Math.PI / 180);
}

/**
 * Winkelumrechnung
 * @param radian Radiant
 * @return {number} Grad
 */
export function toDegree(radian) {
  return (radian * (180 / Math.PI) + 360) % 360;
}

/**
 * Umrechnung zur Darstellung im passenden Verhältnis
 * @param meter
 * @return {number} Pixel
 */
export function toPixel(meter) {
  return (meter / backgroundConst.a0Width) * stageWidth;
}

/**
 * Umrechnung zur Darstellung im passenden Verhältnis
 * @param pixel
 * @return {number} Meter
 */
export function toMeter(pixel) {
  return (pixel * backgroundConst.a0Width) / stageWidth;
}
