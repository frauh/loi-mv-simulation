import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Funk' für micro:bit V1
 */
export default class RadioMapper extends Mapper {

    /**
     * wenn Zahl empfangen
     * @param handler function(receivedNumber)
     */
    onReceivedNumber(handler) {
        //TODO entrypoint
        this.notSupported("Funk.wennZahlEmpfangen", handler)
    }

    /**
     * wenn Text empfangen
     * @param handler function(receivedString)
     */
    onReceivedString(handler) {
        //TODO entrypoint
        return handler;
    }

    /**
     * wenn Wertepaar empfangen
     * @param handler function(name, value)
     */
    onReceivedValue(handler) {
        //TODO entrypoint
        return handler;
    }

    /**
     * setze Funkgruppe auf
     * @param id number
     */
    setGroup(id) {
        this.notSupported("Funk.setzeFunkgruppe", id);
    }

    /**
     * sende Zahl über Funk
     * @param value number
     */
    sendNumber(value) {
        this.notSupported("Funk.sendeZahl", value);
    }

    /**
     * sende Wertepaar über Funk
     * @param name string
     * @param value number
     */
    sendValue(name, value) {
        this.notSupported("Funk.sendeWertepaar", name, value);
    }

    /**
     * sende Text über Funk
     * @param value string
     */
    sendString(value) {
        this.notSupported("Funk.sendeText", value);
    }

    /**
     * empfangenes Paket
     * @param value RadioPacketProperty
     */
    receivedPacket(value) {
        this.notSupported("Funk.empfangenesPaket", value);
    }

    /**
     * setze Sendeleistung auf
     * @param power number
     */
    setTransmitPower(power) {
        this.notSupported("Funk.setzeSendeleistung", power);
    }

    /**
     * setze Übertragungs-Seriennummer über Funk
     * @param transmit boolean
     */
    setTransmitSerialNumber(transmit) {
        this.notSupported("Funk.setzeÜbertragungsseriennummer", transmit);
    }

    /**
     * Setze Funkfrequenzband
     * @param band number
     */
    setFrequencyBand(band) {
        this.notSupported("Funk.setzeFrequenzband", band);
    }


    /**
     * Ereignis auslösen von Quelle mit Wert
     * @param source EventBusSource
     * @param value EentBusValue
     */
    raiseEvent(source, value) {
        this.notSupported("Funk.ereignisAuslösen", source, value);
    }
}