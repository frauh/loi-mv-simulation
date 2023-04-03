export default class Simulation {
    _workers = [];

    constructor(vehicles, objects, logArea) {
        this._vehicles = vehicles;
        this._objects = objects;
        this._logArea = logArea;
    }

    /**
     * Initialisiere die Simulation und starte für jeden Startpunkt/Entrypoint einen Worker, der unabhängig den MakeCode-Code ausführt
     */
    start() {
        //TODO escape entrypoint oder als event verarbeiten
        //FIXME Aufruf später mit try/catch
        let startTime = Date.now();

        this._vehicles.forEach((vehicle) => {
            const worker = this.#createWorker();
            worker.postMessage({
                code: vehicle.program.start,
                vehicleColor: vehicle.color,
                vehicleLabel: vehicle.label,
                startTime: startTime,
            });
            worker.onmessage = ({data: {outputLog}}) => {
                this._logArea.output = this._logArea.output.concat(outputLog);
            };

            // worker.onmessage = ({data: {answer}}) => {
            //     console.log(answer);
            // };

            //TODO für Funktionen müsste beim Start auch erfüllt werden, da dort potentielle Variablen definiert sein können
            // ggf. sharedworker, damit dort die variablen vom einen ins andere weitergegeben, wenn sie verändert wurden?
        });
    }

    stop() {
        while (this._workers.length > 0) {
            let worker = this._workers.pop();
            worker.terminate();
        }
    }

    #createWorker() {
        const worker = new Worker(new URL("@/compositions/SimulationWorker.js", import.meta.url));
        this._workers.push(worker);
        return worker;
    }
}
