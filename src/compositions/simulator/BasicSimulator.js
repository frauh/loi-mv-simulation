import Simulator from "@/compositions/simulator/Simulator";

export default class BasicSimulator extends Simulator {

    _logArea;

    constructor(vehicle, logArea) {
        super(vehicle);
        this._logArea = logArea;
    }

    /**
     * Gibt den Namen des Fahrzeugs zusammen mit der Nachricht im Bereich der LogArea aus
     * @param msg String
     */
    simulateLEDs(msg) {
        let style = "<p style='font-size:14px; padding-left: 3px; padding-right: 3px;'>"
        let label = "".concat("<b style='color:", this._vehicle.color, "'>", this._vehicle.label,": </b>");
        this._logArea.$data.output = this._logArea.$data.output.concat(style, label , msg, "</p>");
    }

    simulatePause(ms) {
        console.log("simulierePause", ms)
    }
}