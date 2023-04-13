import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Funk' für micro:bit V1
 */
export default class RadioMapper extends Simulator {
  /**
   * wenn Zahl empfangen
   * Entrypoint vgl. Parser
   * @param {function} handler
   */
  onReceivedNumber(handler) {
    //TODO entrypoint
    this.notSupported("Funk.wennZahlEmpfangen", handler.toString());
  }

  /**
   * wenn Text empfangen
   * Entrypoint vgl. Parser
   * @param {function} handler
   */
  onReceivedString(handler) {
    //TODO entrypoint
    this.notSupported("Funk.wennZahlEmpfangen", handler.toString());
  }

  /**
   * wenn Wertepaar empfangen
   * Entrypoint vgl. Parser
   * @param {function} handler
   */
  onReceivedValue(handler) {
    //TODO entrypoint
    this.notSupported("Funk.wennZahlEmpfangen", handler.toString());
  }

  /**
   * setze Funkgruppe auf
   * @param {number} id
   */
  setGroup(id) {
    this.notSupported("Funk.setzeFunkgruppe", id);
  }

  /**
   * sende Zahl über Funk
   * @param {number} value
   */
  sendNumber(value) {
    this.notSupported("Funk.sendeZahl", value);
  }

  /**
   * sende Wertepaar über Funk
   * @param {String} name
   * @param {number} value
   */
  sendValue(name, value) {
    this.notSupported("Funk.sendeWertepaar", name, value);
  }

  /**
   * sende Text über Funk
   * @param {String} value
   */
  sendString(value) {
    this.notSupported("Funk.sendeText", value);
  }

  /**
   * empfangenes Paket
   * @param {RadioPacketProperty} value
   * @return {number}
   */
  receivedPacket(value) {
    this.notSupported("Funk.empfangenesPaket", value.toString());
    return 0;
  }

  /**
   * setze Sendeleistung auf
   * @param {number} power number
   */
  setTransmitPower(power) {
    this.notSupported("Funk.setzeSendeleistung", power);
  }

  /**
   * setze Übertragungs-Seriennummer über Funk
   * @param {boolean} transmit
   */
  setTransmitSerialNumber(transmit) {
    this.notSupported(
      "Funk.setzeÜbertragungsseriennummer",
      transmit.toString()
    );
  }

  /**
   * Setze Funkfrequenzband
   * @param {number} band number
   */
  setFrequencyBand(band) {
    this.notSupported("Funk.setzeFrequenzband", band);
  }

  /**
   * Ereignis auslösen von Quelle mit Wert
   * @param {EventBusSource} source EventBusSource
   * @param {EventBusValue} value
   */
  raiseEvent(source, value) {
    this.notSupported(
      "Funk.ereignisAuslösen",
      source.toString(),
      value.toString()
    );
  }
}
