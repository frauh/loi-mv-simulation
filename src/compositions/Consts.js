/**
 * Konstanten für die gesamte Anwendung
 */

/**
 * Berechnungsintervall der Kinematik
 * @type {number} in s
 */
export const deltaT = 0.01;

/**
 * Achslänge des Roboters
 * @type {number} in m
 */
export const b = 0.143;

/**
 * Abstand eines Hell-Dunkel-Sensors vom Mittelpunkt des Roboters (x-Achse)
 * @type {number} in m
 */
export const photocellOffset = 0.1075;

/**
 * Winkel, über den berechnet wird, wie weit der Hell-Dunkel-Sensor von der x-Achse entfernt ist
 * @type {number} in Grad
 */
export const photocellOffsetAngle = 15;

/**
 * Entfernung des Ultraschallsensors vom Mittelpunkt des Roboters
 * @type {number} in m
 */
export const sonarOffset = 0.0935;

/**
 * Winkel, der den Messbereich des Ultraschallsensors aufspannt
 * @type {number} in Grad
 */
export const sonarMeasurementAngle = 15;

/**
 * Radius des NeoPixel LED-Rings
 * @type {number} in m
 */
export const neoPixelRadius = 0.03;

/**
 * Abstand des NeoPixel vom Mittelpunkt des Roboters
 * @type {number} in m
 */
export const neoPixelOffset = 0.1;

/**
 * Winkelumrechnung
 * @param degree
 * @return {number} radian
 */
export function toRadian(degree) {
  return degree * (Math.PI / 180);
}

/**
 * Winkelumrechnung
 * @param radian
 * @return {number} degree
 */
export function toDegree(radian) {
  return (radian * (180 / Math.PI) + 360) % 360;
}

export function toPixel(meter, maxPixel) {
  return (meter / 1.189) * maxPixel;
}

export function toMeter(pixel, maxPixel) {
  return (pixel * 1.189) / maxPixel;
}
