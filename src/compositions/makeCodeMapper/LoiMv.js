import MakeCodeMapper from "@/compositions/makeCodeMapper/MakeCodeMapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LOI_MV' für micro:bit V1
 */
export default class LoiMv extends MakeCodeMapper {

    /**
     *
     * @param kompass Boolean
     */
    init(kompass) {
        this.unused(kompass)
        // nothing to do
    }

    /**
     *
     * @param drehung Number
     * @param tolleranz Number
     */
    graddrehung(drehung, tolleranz) {
        console.log(drehung, tolleranz)
    }

    helligkeitLinks() {
    }

    helligkeitRechts() {
    }

    /**
     *
     * @param power Number
     * @param lenkung Number
     */
    antrieb(power, lenkung) {
        console.log("antrieb", power, lenkung)
    }

    ultraschall() {
    }

}