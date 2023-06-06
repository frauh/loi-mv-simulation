export default class Simulator {
  /**
   * Fallback, wenn eine der definierten Funktionen in der Simulation nicht unterstützt wird.
   * @param {String} name Funktionsname
   * @param {String|number} param Parameter der Funktion
   */
  notSupported(name, ...param) {
    console.warn(
      "Die Funktion ".concat(
        name,
        "(",
        param.toString(),
        ") wird in der Simulation nicht unterstützt."
      )
    );
  }

  /**
   * sendet eine Nachricht vom Worker zurück
   * @param {WorkerMessageKey} key
   * @param {String|number|boolean} value
   */
  commit(key, value) {
    self.postMessage({
      key: key,
      value: value,
    });
  }
}
