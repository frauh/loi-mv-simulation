import Simulator from "@/compositions/simulator/Simulator";
import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";

export default class NeopixelSimulator extends Simulator {
  turnOn(color) {
    this.commit(WorkerMessageKey.neoPixelColor, color);
  }

  turnOff() {
    this.commit(WorkerMessageKey.neoPixelColor, "");
  }
}
