export default class Mapper {
    _simulator;

    constructor(simulator) {
        this._simulator = simulator;
    }

    /**
     * Fallback, wenn eine der definierten Funktionen in der Simulation nicht unterstützt wird.
     * @param name Funktionsname
     * @param param Parameter der Funktion
     */
    notSupported(name, ...param) {
        console.warn("Die Funktion ".concat(name, "(", param.toString(), ") wird in der Simulation nicht unterstützt."));
    }

    /**
     * Fallback, wenn Parameter von Funktionen nicht benötigt werden
     * @param name Funktionsname
     * @param param
     */
    unused(name, ...param) {
        console.warn("Parameter für ".concat(name, "(", param.toString(), ") werden nicht beachtet."));
    }
}
