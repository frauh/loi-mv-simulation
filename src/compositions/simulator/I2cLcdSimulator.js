import Simulator from "@/compositions/simulator/Simulator";

export default class I2cLcdSimulator extends Simulator {
    _display = ["", ""];

    constructor(vehicle, logArea) {
        super(vehicle);
        this._logArea = logArea;
    }

    /**
     * leert die Anzeige
     */
    simulateClearLcd(){
        this._display = ["", ""];
    }

    /**
     * gibt den Namen des Fahrzeugs zusammen mit der Nachricht aus
     * @param value String Nachricht
     * @param x Number Spalte auf dem Display (0-15)
     * @param y Number Zeile auf dem Display (0-1)
     */
    simulateLcd(value, x, y) {
        this._display[y] = this.#addToLine(this._display[y], value, x)
        let style = "<p style='font-size:14px; padding-left: 3px; padding-right: 3px;'>";
        let label = "".concat("<b style='color:", this._vehicle.color, "'>", this._vehicle.label, ": </b><br/>");
        this._logArea.$data.output = this._logArea.$data.output.concat(style, label, this._display.join("<br/>"), "</p>");
    }

    #addToLine(line, value, position) {
        if (!line || line.length < position) {
            return this.#insertOutsideOfCurrent(line, value, position);
        }
        let before = line.slice(0, position);
        let after = line.slice(position + value.length);
        return before.concat(value, after);
    }

    #insertOutsideOfCurrent(line, value, position) {
        while (line.length < position) {
            line = line.concat(" ");
        }
        return line.concat(value);
    }
}