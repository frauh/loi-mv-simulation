import { toPixel, toRadian, vehicleConst } from "@/compositions/Consts";

export default class Collision {
  constructor(obstacles) {
    let lines = [];
    let circles = [];
    obstacles.forEach((obstacle) => {
      let rotation = toRadian(obstacle.rotation);
      switch (obstacle.type) {
        case "Circle":
          circles.push(new Circle(obstacle.center, obstacle.width));
          break;
        case "Rect":
          lines.push(
            new Line(
              -obstacle.width,
              -obstacle.height,
              +obstacle.width,
              -obstacle.height,
              rotation,
              obstacle.center
            ),
            new Line(
              +obstacle.width,
              -obstacle.height,
              +obstacle.width,
              +obstacle.height,
              rotation,
              obstacle.center
            ),
            new Line(
              +obstacle.width,
              +obstacle.height,
              -obstacle.width,
              +obstacle.height,
              rotation,
              obstacle.center
            ),
            new Line(
              -obstacle.width,
              +obstacle.height,
              -obstacle.width,
              -obstacle.height,
              rotation,
              obstacle.center
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
    let x = toPixel(pose.x + Math.cos(rotation) * vehicleConst.rotationOffset);
    let y = toPixel(pose.y + Math.sin(rotation) * vehicleConst.rotationOffset);
    let widthHalf = toPixel(vehicleConst.width / 2);
    let heightHalf = toPixel(vehicleConst.height / 2);
    let bodyHeightHalf = toPixel(vehicleConst.bodyHeight / 2);
    let wheelFrontDistance = toPixel(vehicleConst.wheelFrontDistance);
    let wheelRearDistance = toPixel(vehicleConst.wheelRearDistance);
    return [
      // Frontstoßstange
      new Line(
        +widthHalf,
        +bodyHeightHalf,
        +widthHalf,
        -bodyHeightHalf,
        rotation,
        { x: x, y: y }
      ),
      // Heckstoßstange
      new Line(
        -widthHalf,
        +bodyHeightHalf,
        -widthHalf,
        -bodyHeightHalf,
        rotation,
        { x: x, y: y }
      ),
      // Kotflügel vorne
      new Line(
        +widthHalf,
        +bodyHeightHalf,
        +widthHalf - wheelFrontDistance,
        +bodyHeightHalf,
        rotation,
        { x: x, y: y }
      ),
      new Line(
        +widthHalf,
        -bodyHeightHalf,
        +widthHalf - wheelFrontDistance,
        -bodyHeightHalf,
        rotation,
        { x: x, y: y }
      ),
      // Kotflügel hinten
      new Line(
        -widthHalf,
        +bodyHeightHalf,
        -widthHalf + wheelRearDistance,
        +bodyHeightHalf,
        rotation,
        { x: x, y: y }
      ),
      new Line(
        -widthHalf,
        -bodyHeightHalf,
        -widthHalf + wheelRearDistance,
        -bodyHeightHalf,
        rotation,
        { x: x, y: y }
      ),
      // Radüberstand vorne
      new Line(
        +widthHalf - wheelFrontDistance,
        +bodyHeightHalf,
        +widthHalf - wheelFrontDistance,
        +heightHalf,
        rotation,
        { x: x, y: y }
      ),
      new Line(
        +widthHalf - wheelFrontDistance,
        -bodyHeightHalf,
        +widthHalf - wheelFrontDistance,
        -heightHalf,
        rotation,
        { x: x, y: y }
      ),
      // Radüberstand hinten
      new Line(
        -widthHalf + wheelRearDistance,
        +bodyHeightHalf,
        -widthHalf + wheelRearDistance,
        +heightHalf,
        rotation,
        { x: x, y: y }
      ),
      new Line(
        -widthHalf + wheelRearDistance,
        -bodyHeightHalf,
        -widthHalf + wheelRearDistance,
        -heightHalf,
        rotation,
        { x: x, y: y }
      ),
      // ein großer Radkasten
      new Line(
        +widthHalf - wheelFrontDistance,
        +heightHalf,
        -widthHalf + wheelRearDistance,
        +heightHalf,
        rotation,
        { x: x, y: y }
      ),
      new Line(
        +widthHalf - wheelFrontDistance,
        -heightHalf,
        -widthHalf + wheelRearDistance,
        -heightHalf,
        rotation,
        { x: x, y: y }
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
      const a = line.a.y - line.b.y;
      const b = line.b.x - line.a.x;
      const c =
        (line.a.x - line.b.x) * line.a.y + line.a.x * (line.b.y - line.a.y);
      const distance =
        Math.abs(a * circle.center.x + b * circle.center.y + c) /
        Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      if (distance <= circle.radius) {
        const x =
          (b * (b * circle.center.x - a * circle.center.y) - a * c) /
          (Math.pow(a, 2) + Math.pow(b, 2));
        const y =
          (a * (-b * circle.center.x + a * circle.center.y) - b * c) /
          (Math.pow(a, 2) + Math.pow(b, 2));
        return this.#isPointOnLine(line, { x: x, y: y });
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
   * Prüft, ob ein Punkt auf der Geraden AB zwischen den A und B liegt.
   * @param {Line} line Gerade
   * @param {{x: number, y: number}} point zu überprüfender Punkt
   * @returns {boolean}
   */
  #isPointOnLine(line, point) {
    return (
      point.x <= Math.max(line.a.x, line.b.x) &&
      point.x >= Math.min(line.a.x, line.b.x) &&
      point.y <= Math.max(line.a.y, line.b.y) &&
      point.y >= Math.min(line.a.y, line.b.y)
    );
  }
}

class Line {
  /**
   * Erstellt eine Gerade AB
   * @param {number} aX Punkt A Entfernung x-Achse zum Zentrum
   * @param {number} aY Punkt A Entfernung y-Achse zum Zentrum
   * @param {number} bX Punkt B Entfernung x-Achse zum Zentrum
   * @param {number} bY Punkt B Entfernung y-Achse zum Zentrum
   * @param {number} rotation Radiant
   * @param {{x: number, y: number}} rotationCenter
   */
  constructor(aX, aY, bX, bY, rotation, rotationCenter) {
    if (!rotationCenter) {
      this._a = { x: aX, y: aY };
      this._b = { x: bX, y: bY };
    } else {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      this._a = {
        x: aX * cos - aY * sin + rotationCenter.x,
        y: aX * sin + aY * cos + rotationCenter.y,
      };
      this._b = {
        x: bX * cos - bY * sin + rotationCenter.x,
        y: bX * sin + bY * cos + rotationCenter.y,
      };
    }
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
   * @param {{x: number, y: number}} Mittelpunkt
   * @param {number} radius Radius
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
