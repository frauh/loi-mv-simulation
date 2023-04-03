import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Sonar' für micro:bit V1
 * vgl. https://github.com/microsoft/pxt-sonar
 */
export default class SonarMapper extends Mapper {
    /**
     * ping
     * @param trig DigitalPin
     * @param echo DigitalPin
     * @param unit PingUnit
     */
    ping(trig, echo, unit) {
        this.notSupported("Sonar.ping", trig, echo, unit);
    }
}
