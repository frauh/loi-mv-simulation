import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";
import { stageWidth } from "@/compositions/Consts";

export default class Simulation {
  _workers = [];

  get isRunning() {
    return this._workers.length > 0;
  }

  /**
   * Initialisiere die Simulation und starte für jeden Startpunkt/Entrypoint einen Worker, der unabhängig den MakeCode-Code ausführt
   */
  start(vehicles, backgroundLayerImageData, obstacles, logArea) {
    let startTime = Date.now();

    vehicles.forEach((vehicle) => {
      vehicle.startPose = vehicle.pose;

      if (vehicle.program && vehicle.program.start) {
        //TODO auch für entrypoints
        const worker = new Worker(
          new URL(
            "@/compositions/simulation/SimulationWorker.js",
            import.meta.url
          )
        );
        this._workers.push(worker);
        worker.postMessage({
          stageWidth: stageWidth,
          code: vehicle.program.start, //TODO auch für entrypoints
          vehicleColor: vehicle.color,
          vehicleLabel: vehicle.label,
          startTime: startTime,
          pose: {
            x: vehicle.pose.x,
            y: vehicle.pose.y,
            theta: vehicle.pose.theta,
          },
          backgroundImageData: backgroundLayerImageData,
          obstacles: obstacles,
        });

        let isCalculating = false;
        let hasAlreadyFinished = false;
        worker.onmessage = ({ data: { key, value } }) => {
          switch (key) {
            case WorkerMessageKey.evalFinished:
              if (!isCalculating) {
                this._workers.splice(this._workers.indexOf(worker), 1);
                worker.terminate();
              }
              hasAlreadyFinished = value;
              break;
            case WorkerMessageKey.intervalCalculating:
              isCalculating = value;
              if (hasAlreadyFinished) {
                this._workers.splice(this._workers.indexOf(worker), 1);
                worker.terminate();
              }
              break;
            case WorkerMessageKey.pose:
              vehicle.pose = value;
              break;
            case WorkerMessageKey.outputLog:
              logArea.output = logArea.output.concat(value);
              break;
            case WorkerMessageKey.neoPixelColor:
              vehicle.neoPixelColor = value;
              break;
            default:
              console.error(
                "Ergebnis des Workers kann nicht zugeordnet werden:",
                key
              );
          }
        };
        worker.onerror = (ev) => {
          console.error("Fehler beim Ausführen der Simulation!", ev);
          this.stop();
        };
      }
      //TODO für Funktionen müsste beim Start auch erfüllt werden, da dort potentielle Variablen definiert sein können
      // ggf. sharedworker, damit dort die variablen vom einen ins andere weitergegeben, wenn sie verändert wurden?
    });
  }

  stop() {
    while (this._workers.length > 0) {
      this._workers.pop().terminate();
    }
  }
}
