import { randomPosition, toMeter } from "@/compositions/Consts";

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
    const randomPose = randomPosition();
    this.pose = this.startPose = {
      x: toMeter(randomPose.x),
      y: toMeter(randomPose.y),
      theta:
        this.#standardOrientations[
          Math.floor(Math.random() * this.#standardOrientations.length)
        ],
    };
  }
}
