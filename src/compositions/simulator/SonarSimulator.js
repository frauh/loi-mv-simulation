import SonarMapper from "@/compositions/makeCodeMapper/SonarMapper";
import { PingUnit } from "@/compositions/simulation/SimulationWorker";
import { sonarConst, toMeter, toPixel, toRadian } from "@/compositions/Consts";

export default class SonarSimulator extends SonarMapper {
  /**
   * maximale Entfernung, die vom Sensor gemessen wird
   * @private
   * @type {number}
   */
  _maxDistance;

  constructor(pose, obstacles) {
    super();
    this._pose = pose;
    this._obstacleBorders = [];
    obstacles.forEach((obstacle) => {
      switch (obstacle.type) {
        case "Circle":
          this.#addCircleBorder(obstacle.position, obstacle.width / 2);
          break;
        case "Rect":
          this.#addRectangleBorder(
            obstacle.position,
            obstacle.width,
            obstacle.height,
            obstacle.rotation
          );
          break;
      }
    });
  }

  /**
   *
   * @param {number} trig
   * @param {number} echo
   * @param {String} unit
   * @param {number} maxCmDistance
   * @returns {number}
   */
  // eslint-disable-next-line no-unused-vars
  ping(trig, echo, unit, maxCmDistance = 500) {
    if (unit === PingUnit.MicroSeconds) {
      this.notSupported("Sonar.ping", "unit === MicroSeconds");
      return 0;
    }
    this._maxDistance = maxCmDistance / 100 + sonarConst.offset;
    let minDistance = this._maxDistance;
    let newMin = this.#calculateLowestDistanceInsideMeasurementAngle(
      this._obstacleBorders
    );
    if (newMin < minDistance) {
      minDistance = newMin;
    }
    minDistance = minDistance * sonarConst.inaccuracy;
    return unit === PingUnit.Inches
      ? (minDistance - sonarConst.offset) * 39.37008
      : (minDistance - sonarConst.offset) * 100;
  }

  /**
   * Identifiziert Punkte auf dem Rand des Kreises und fügt diese this._obstacleBorder hinzu. In Pixel
   * @param {{x: number, y: number}} center Kreismittelpunk
   * @param {number} radius Radius
   */
  #addCircleBorder(center, radius) {
    const step = Math.PI / radius;
    for (let i = 0; i < 2 * Math.PI; i += step) {
      this._obstacleBorders.push({
        x: center.x + radius * Math.cos(i),
        y: center.y + radius * Math.sin(i),
      });
    }
  }

  /**
   * Identifiziert Punkte auf dem Rand des Vierecks und fügt diese this._obstacleBorder hinzu. In Pixel
   * @param {{x: number, y: number}} topLeft Koordinate der linken oberen Ecke des ungedrehten Vierecks
   * @param {number} width Breite des Vierecks
   * @param {number} height Höhe des Vierecks
   * @param {number} rotation Winkel, um den das Viereck gedreht ist in Grad
   */
  #addRectangleBorder(topLeft, width, height, rotation) {
    rotation = toRadian(rotation);
    const bottomRight = { x: topLeft.x + width, y: topLeft.y + height };
    const xRotationFaktor = Math.cos(rotation);
    const yRotationFaktor = Math.sin(rotation);
    for (let i = topLeft.x; i < bottomRight.x; i++) {
      this._obstacleBorders.push(
        {
          x: i * xRotationFaktor + i * yRotationFaktor,
          y: topLeft.y * xRotationFaktor + topLeft.y * yRotationFaktor,
        },
        {
          x: i * xRotationFaktor + i * yRotationFaktor,
          y: bottomRight.y * xRotationFaktor + bottomRight.y * yRotationFaktor,
        }
      );
    }
    for (let i = topLeft.y; i < bottomRight.y; i++) {
      this._obstacleBorders.push(
        {
          x: topLeft.x * xRotationFaktor + topLeft.x * yRotationFaktor,
          y: i * xRotationFaktor + i * yRotationFaktor,
        },
        {
          x: bottomRight.x * xRotationFaktor + bottomRight.x * yRotationFaktor,
          y: i * xRotationFaktor + i * yRotationFaktor,
        }
      );
    }
  }

  /**
   * Berechnet den geringsten Abstand innerhalb des Messbereichs um die Pose mit entsprechendem Winkel.
   * Rechnet in Pixel
   * @param {{x:number, y:number}[]} points Punkte,
   * @returns {number} abstand des am geringsten entfernten Punktes
   */
  #calculateLowestDistanceInsideMeasurementAngle(points) {
    let min;
    const startPoint = { x: toPixel(this._pose.x), y: toPixel(this._pose.y) };
    const leftPoint = this.#getTrianglePoint(
      startPoint,
      this._pose.theta - sonarConst.measurementAngle / 2
    );
    const rightPoint = this.#getTrianglePoint(
      startPoint,
      this._pose.theta + sonarConst.measurementAngle / 2
    );
    const triangle = [startPoint, leftPoint, rightPoint];
    points.forEach((point) => {
      if (this.#polygonContainsPoint(triangle, point)) {
        const distance = Math.sqrt(
          Math.pow(point.x - startPoint.x, 2) +
            Math.pow(point.y - startPoint.y, 2)
        );
        if (!min || distance < min) {
          min = distance;
        }
      }
    });
    return toMeter(min);
  }

  /**
   * Gibt den zweiten Punkt der Hypotenuse im rechtwinkligen Dreieck aus.
   * @param {{x:number, y:number}} Startpunkt
   * @param angle Winkel im Startpunkt
   * @returns {{x: number, y: number}} Koordinaten eines Eckpunktes in Pixel
   */
  #getTrianglePoint({ x, y }, angle) {
    return {
      x: x + Math.cos(toRadian(angle)) * toPixel(this._maxDistance),
      y: y + Math.sin(toRadian(angle)) * toPixel(this._maxDistance),
    };
  }

  /**
   * Der Punkt liegt innerhalb eines Polygons, wenn die Anzahl der Schnitte des Strahls,
   * der vom Punkt ausgeht, ungerade ist -> Jordansches Kurventheorem.
   * Rechnet mit Pixel.
   * @param {{x: number, y: number}[]} polygon Koordinaten, die ei Polygon aufspannen
   * @param {{x: number, y: number}} proof Punkt, der überprüft werden soll
   */
  #polygonContainsPoint(polygon, proof) {
    if (polygon.length < 3) {
      return false;
    }
    // "Endpunkt" des Strahls vom Punkt proof aus
    let tmp = { x: 99999, y: proof.y };
    let count = 0;
    let i = 0;
    do {
      // Kante des Polygons als Gerade AB
      let a = polygon[i];
      let b = polygon[(i + 1) % polygon.length];
      if (this.#hasLineIntersection(a, b, proof, tmp)) {
        // Kante und Strahl schneiden sich (irgendwo)
        if (this.#lineDirectionOfPoint(a, proof, b) === 0) {
          return this.#isPointOnLine(a, b, proof);
        }
        count++;
      }
      i = (i + 1) % polygon.length;
    } while (i !== 0);
    // Anzahl der Schnittpunkte ist ungerade
    return count & 1;
  }

  /**
   * Berechnet, ob es einen Schnittpunkt der Linien AB und CD gibt
   * @param {{x: number, y: number}} a Startpunkt der Gerade AB
   * @param {{x: number, y: number}} b Endpunkt der Gerade AB
   * @param {{x: number, y: number}} c Startpunkt der Gerade CD
   * @param {{x: number, y: number}} d Endpunkt der Gerade CD
   * @returns {boolean}
   */
  #hasLineIntersection(a, b, c, d) {
    // Vier Positionierungen für zwei Geraden und jeweils einen Punkt der anderen Geraden
    let dir1 = this.#lineDirectionOfPoint(a, b, c);
    let dir2 = this.#lineDirectionOfPoint(a, b, d);
    let dir3 = this.#lineDirectionOfPoint(c, d, a);
    let dir4 = this.#lineDirectionOfPoint(c, d, b);
    return (
      (dir1 !== dir2 && dir3 !== dir4) || // Schnittpunkt
      (dir1 === 0 && this.#isPointOnLine(a, b, c)) || // Punkt C liegt auf AB
      (dir2 === 0 && this.#isPointOnLine(a, b, d)) || // Punkt D liegt auf AB
      (dir3 === 0 && this.#isPointOnLine(c, d, a)) || // Punkt A liegt auf CD
      (dir4 === 0 && this.#isPointOnLine(c, d, b)) // Punkt B liegt auf CD
    );
  }

  /**
   * Prüft, auf welcher Seite der Geraden AB der Punkt liegt
   * @param {{x: number, y: number}} a Startpunkt der Gerade
   * @param {{x: number, y: number}} b Endpunkt der Gerade
   * @param {{x: number, y: number}} proof zu überprüfender Punkt
   * @returns {0|1|2} 0: kollinear, 1: entgegen Uhrzeigersinn, 2: im Uhrzeigersinn
   */
  #lineDirectionOfPoint(a, b, proof) {
    let number = (b.y - a.y) * (proof.x - b.x) - (b.x - a.x) * (proof.y - b.y);
    if (number === 0) {
      return 0;
    } else if (number < 0) {
      return 2;
    } else {
      return 1;
    }
  }

  /**
   * Prüft, ob ein Punkt auf der Geraden AB liegt.
   * @param {{x: number, y: number}} a Startpunkt der Gerade
   * @param {{x: number, y: number}} b Endpunkt der Gerade
   * @param {{x: number, y: number}} proof zu überprüfender Punkt
   * @returns {boolean}
   */
  #isPointOnLine(a, b, proof) {
    return (
      proof.x <= Math.max(a.x, b.x) &&
      proof.x <= Math.min(a.x, b.x) &&
      proof.y <= Math.max(a.y, b.y) &&
      proof.y <= Math.min(a.y, b.y)
    );
  }
}
