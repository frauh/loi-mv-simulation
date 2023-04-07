import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'LOI_MV' für micro:bit V1
 * vgl. https://github.com/eschaetz/loi-mv-sek1
 */
export default class LoiMvMapper extends Mapper {
    /**
     *
     * @param kompass Boolean
     */
    init(kompass) {
        this.unused("LOI_MV.init", kompass);
        // nothing to do
    }

    /**
     *
     * @param drehung Number
     * @param tolleranz Number
     */
    graddrehung(drehung, tolleranz) {
        this.unused("LOI_MV.graddrehung", tolleranz);
        this._simulator.simulateRotation(drehung)
    }

    helligkeitLinks() {
    }

    helligkeitRechts() {
    }

    /**
     *
     * @param power Number (-10...10)
     * @param lenkung Number (-10...10)
     */
    antrieb(power, lenkung) {
        this._simulator.simulateMotors(power, lenkung);
    }

    ultraschall() {
    }

}
