import { toPixel, toRadian, vehicleConst } from "@/compositions/Consts";

export default class Collision {
  constructor(obstacles) {
    let lines = [];
    let circles = [];
    obstacles.forEach((obstacle) => {
      let rotation = toRadian(obstacle.rotation);
      switch (obstacle.type) {
        case "Circle":
          circles.push(new Circle(obstacle.position, obstacle.width / 2));
          break;
        case "Rect":
          lines.push(
            new Line(
              obstacle.position.x,
              obstacle.position.y,
              obstacle.position.x + obstacle.width,
              obstacle.position.y,
              rotation
            ),
            new Line(
              obstacle.position.x,
              obstacle.position.y,
              obstacle.position.x,
              obstacle.position.y + obstacle.height,
              rotation
            ),
            new Line(
              obstacle.position.x + obstacle.width,
              obstacle.position.y + obstacle.height,
              obstacle.position.x + obstacle.width,
              obstacle.position.y,
              rotation
            ),
            new Line(
              obstacle.position.x + obstacle.width,
              obstacle.position.y + obstacle.height,
              obstacle.position.x,
              obstacle.position.y + obstacle.height,
              rotation
            )
          );
          break;
      }
    });
    this._lines = lines;
    this._circles = circles;
  }

  /**
   * Prüft, ob eine Kollision des Roboters mit einem Hindernis stattgefunden hat
   * @param {{x: number, y: number, theta: number}} pose Postion des Roboters
   * @returns {boolean}
   */
  happened(pose) {
    for (let line of this.#mapVehicle(pose)) {
      if (
        this.#hasCircleIntersection(line) ||
        this.#hasLineIntersection(line)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Modelliert geometrisch den Rahmen des Roboters
   * @param {{x: number, y: number, theta: number}} pose Postion des Roboters
   * @returns Line[]
   */
  #mapVehicle(pose) {
    let rotation = toRadian(pose.theta);
    let x = toPixel(pose.x);
    let y = toPixel(pose.y);
    let width = toPixel(vehicleConst.width / 2);
    let height = toPixel(vehicleConst.height / 2);
    let bodyHeight = toPixel(vehicleConst.bodyHeight / 2);
    let wheelFrontDistance = toPixel(vehicleConst.wheelFrontDistance);
    let wheelRearDistance = toPixel(vehicleConst.wheelRearDistance);
    return [
      // Frontstoßstange
      new Line(x + width, y + bodyHeight, x + width, y - bodyHeight, rotation),
      // Heckstoßstange
      new Line(x - width, y + bodyHeight, x - width, y - bodyHeight, rotation),
      // Kotflügel vorne
      new Line(
        x + width,
        y + bodyHeight,
        x + width - wheelFrontDistance,
        y + bodyHeight,
        rotation
      ),
      new Line(
        x + width,
        y - bodyHeight,
        x + width - wheelFrontDistance,
        y - bodyHeight,
        rotation
      ),
      // Kotflügel hinten
      new Line(
        x - width,
        y + bodyHeight,
        x - width + wheelRearDistance,
        y + bodyHeight,
        rotation
      ),
      new Line(
        x - width,
        y - bodyHeight,
        x - width + wheelRearDistance,
        y - bodyHeight,
        rotation
      ),
      // Radüberstand vorne
      new Line(
        x + width - wheelFrontDistance,
        y + bodyHeight,
        x + width - wheelFrontDistance,
        y + height,
        rotation
      ),
      new Line(
        x + width - wheelFrontDistance,
        y - bodyHeight,
        x + width - wheelFrontDistance,
        y - height,
        rotation
      ),
      // Radüberstand hinten
      new Line(
        x - width + wheelRearDistance,
        y + bodyHeight,
        x - width + wheelRearDistance,
        y + height,
        rotation
      ),
      new Line(
        x - width + wheelRearDistance,
        y - bodyHeight,
        x - width + wheelRearDistance,
        y - height,
        rotation
      ),
      // ein großer Radkasten
      new Line(
        x + width - wheelFrontDistance,
        y + height,
        x - width + wheelRearDistance,
        y + height,
        rotation
      ),
      new Line(
        x + width - wheelFrontDistance,
        y - height,
        x - width + wheelRearDistance,
        y - height,
        rotation
      ),
    ];
  }

  /**
   * Prüft, ob die Gerade einen der Kreise schneidet oder berührt
   * @param {Line} line
   * @returns boolean
   */
  #hasCircleIntersection(line) {
    for (let circle of this._circles) {
      let distance =
        Math.abs(
          (line.b.x - line.a.x) * (line.a.y - circle.center.y) -
            (line.a.x - circle.center.x) * (line.b.y - line.a.y)
        ) /
        Math.sqrt(
          Math.pow(line.b.x - line.a.x, 2) + Math.pow(line.b.y - line.a.y, 2)
        );
      if (distance <= circle.radius) {
        return true;
      }
    }
    return false;
  }

  /**
   * Prüft, ob die Gerade eine andere Gerade (der Vierecke) schneidet
   * @param {Line} line
   * @returns boolean
   */
  #hasLineIntersection(line) {
    for (let rectLine of this._lines) {
      // Vier Positionierungen für zwei Geraden und jeweils einen Punkt der anderen Geraden
      let dir1 = this.#lineDirectionOfPoint(line, rectLine.a);
      let dir2 = this.#lineDirectionOfPoint(line, rectLine.b);
      let dir3 = this.#lineDirectionOfPoint(rectLine, line.a);
      let dir4 = this.#lineDirectionOfPoint(rectLine, line.b);
      if (
        // Schnittpunkt
        (dir1 !== dir2 && dir3 !== dir4) ||
        // Sonderfälle
        (dir1 === 0 && this.#isPointOnLine(line, rectLine.a)) ||
        (dir2 === 0 && this.#isPointOnLine(line, rectLine.b)) ||
        (dir3 === 0 && this.#isPointOnLine(rectLine, line.a)) ||
        (dir4 === 0 && this.#isPointOnLine(rectLine, line.b))
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Prüft, auf welcher Seite der Geraden AB der Punkt liegt
   * @param {Line} line Gerade
   * @param {{x: number, y: number}} point zu überprüfender Punkt
   * @returns {0|1|2} 0: kollinear, 1: entgegen Uhrzeigersinn, 2: im Uhrzeigersinn
   */
  #lineDirectionOfPoint(line, point) {
    let number =
      (line.b.y - line.a.y) * (point.x - line.b.x) -
      (line.b.x - line.a.x) * (point.y - line.b.y);
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
   * @param {Line} line Gerade
   * @param {{x: number, y: number}} point zu überprüfender Punkt
   * @returns {boolean}
   */
  #isPointOnLine(line, point) {
    return (
      point.x <= Math.max(line.a.x, line.b.x) &&
      point.x <= Math.min(line.a.x, line.b.x) &&
      point.y <= Math.max(line.a.y, line.b.y) &&
      point.y <= Math.min(line.a.y, line.b.y)
    );
  }
}

class Line {
  /**
   * Erstellt eine Gerade AB
   * @param aX Punkt A ohne Rotation
   * @param aY Punkt A ohne Rotation
   * @param bX Punkt B ohne Rotation
   * @param bY Punkt B ohne Rotation
   * @param rotation Radiant
   */
  constructor(aX, aY, bX, bY, rotation = 0) {
    const xRotationFaktor = Math.cos(rotation);
    const yRotationFaktor = Math.sin(rotation);
    this._a = {
      x: aX * xRotationFaktor + aX * yRotationFaktor,
      y: aY * xRotationFaktor + aY * yRotationFaktor,
    };
    this._b = {
      x: bX * xRotationFaktor + bX * yRotationFaktor,
      y: bY * xRotationFaktor + bY * yRotationFaktor,
    };
    this._rotation = rotation;
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }
}

class Circle {
  /**
   * Modelliert einen Kreis
   * @param {{x, y}} Mittelpunkt
   * @param radius Radius
   */
  constructor({ x, y }, radius) {
    this._center = { x, y };
    this._radius = radius;
  }

  get center() {
    return this._center;
  }

  get radius() {
    return this._radius;
  }
}
