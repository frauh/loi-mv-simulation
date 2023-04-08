import WorkerMessageKey from "@/compositions/simulation/WorkerMessageKey";

export default class Simulation {
  _workers = [];

  constructor(logArea) {
    this._logArea = logArea;
  }

  _vehicles = [];

  set vehicles(value) {
    this._vehicles = value;
  }

  get isRunning() {
    return this._workers.length > 0;
  }

  /**
   * Initialisiere die Simulation und starte für jeden Startpunkt/Entrypoint einen Worker, der unabhängig den MakeCode-Code ausführt
   */
  start() {
    let startTime = Date.now();

    this._vehicles.forEach((vehicle) => {
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
          code: vehicle.program.start, //TODO auch für entrypoints
          vehicleColor: vehicle.color,
          vehicleLabel: vehicle.label,
          startTime: startTime,
          pose: [vehicle.pose.x, vehicle.pose.y, vehicle.pose.theta],
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
            case WorkerMessageKey.outputLog:
              this._logArea.output = this._logArea.output.concat(value);
              break;
            case WorkerMessageKey.pose:
              vehicle.pose = { x: value[0], y: value[1], theta: value[2] };
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
