export default class Vehicle {
  #standardOrientations = [0, 45, 90, 135, 180, 225, 270, 315];
  id = 0;
  color = "";
  label = "";
  isTracked = false;
  program = { start: "", functions: [] };
  pose;
  startPose;
  neoPixelColor = "";

  constructor(color, label) {
    this.id = Math.floor(Math.random() * 100000);
    this.color = color;
    this.label = label;
    this.pose = this.startPose = {
      x: 0.3 + Math.random() * 0.75,
      y: 0.15 + Math.random() * 0.6,
      theta:
        this.#standardOrientations[
          Math.floor(Math.random() * this.#standardOrientations.length)
        ],
    };
  }
}
