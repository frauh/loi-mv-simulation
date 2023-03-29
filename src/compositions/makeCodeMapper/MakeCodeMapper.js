import Vehicle from "@/compositions/Vehicle";

export default class MakeCodeMapper {

    _vehicle = new Vehicle();

    constructor(vehicle) {
        this._vehicle = vehicle;
    }

    /**
     * Fallback, wenn eine der definierten Funktionen in der Simulation nicht unterstützt wird.
     * @param name Funktionsname
     * @param param Parameter der Funktion
     */
    notSupported(name, ...param) {
        console.warn("Die Funktion " + name + "(" + (!param || param.isEmpty) ? "" : param.join(", ") + ") wird in der Simulation nicht unterstützt.")
    }

    /**
     * Fallback, wenn Parameter von Funktionen nicht benötigt werden
     * @param param
     */
    unused(...param) {
        console.warn("Parameter (" + (!param || param.isEmpty) ? "" : param.join(", ") + ") wird nicht beachtet")
    }

}