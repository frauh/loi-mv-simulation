import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Schleifen' für micro:bit V1
 */
export default class LoopsMapper extends Mapper {

    /**
     * alle ... ms
     * Entrypoint vgl. Parser
     * @param intervall Number
     * @param handler function()
     */
    everyInterval(intervall, handler) {
        // TODO entrypoint
        this.notSupported("Schleifen.alle ms", intervall, handler)
    }
}