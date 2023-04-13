import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Schleifen' für micro:bit V1
 */
export default class LoopsMapper extends Simulator {
  /**
   * alle ... ms
   * Entrypoint vgl. Parser
   * @param {number} intervall
   * @param {function} handler
   */
  everyInterval(intervall, handler) {
    // TODO entrypoint
    this.notSupported("Schleifen.alle ms", intervall, handler.toString());
  }
}
