import MakeCodeMapper from "@/compositions/makeCodeMapper/MakeCodeMapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Schleifen' für micro:bit V1
 */
export default class Loops extends MakeCodeMapper {

    /**
     * alle ... ms
     * @param intervall Number
     * @param handler function()
     */
    everyInterval(intervall, handler) {
        // TODO entrypoint
        this.notSupported("Schleifen.alle ms", intervall, handler)
    }
}