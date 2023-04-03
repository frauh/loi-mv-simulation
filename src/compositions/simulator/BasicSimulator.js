import Simulator from "@/compositions/simulator/Simulator";

export default class BasicSimulator extends Simulator {

    constructor(vehicleColor, vehicleLabel) {
        super();
        this._vehicleColor = vehicleColor;
        this._vehicleLabel = vehicleLabel;
    }

    /**
     * Gibt den Namen des Fahrzeugs zusammen mit der Nachricht zur Darstellung in der LogArea aus
     * @param msg String
     */
    simulateLEDs(msg) {
        let style = "<p style='font-size:14px; padding-left: 3px; padding-right: 3px;'>"
        let label = "".concat("<b style='color:", this._vehicleColor, "'>", this._vehicleLabel,": </b>");
        self.postMessage({
            outputLog: style.concat(label , msg, "</p>")
        });
    }

}