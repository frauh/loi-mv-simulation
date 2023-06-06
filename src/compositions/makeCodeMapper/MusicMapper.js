import Simulator from "@/compositions/makeCodeMapper/Simulator";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Musik' für micro:bit V1
 */
export default class MusicMapper extends Simulator {
  /**
   * Wenn Musik
   * Entrypoint vgl. Parser
   * @param {MusicEvent} value
   * @param {function} handler
   */
  onEvent(value, handler) {
    //TODO entrypoint
    this.notSupported("Musik.wennMusik", value.toString(), handler.toString());
  }

  /**
   * spiele Melodie im Tempo
   * @param {String} melody
   * @param {number} tempo
   */
  playMelody(melody, tempo) {
    this.notSupported("Musik.spieleMelodie", melody, tempo);
  }

  /**
   * spiele Note für Dauer
   * @param {number} frequency
   * @param {number} ms
   */
  playTone(frequency, ms) {
    this.notSupported("Musik.spieleNote", frequency, ms);
  }

  /**
   * Note
   * @param {number} frequency
   */
  ringTone(frequency) {
    this.notSupported("Musik.Note", frequency);
  }

  /**
   * pausiere
   * @param {number} ms
   */
  rest(ms) {
    this.notSupported("Musik.pausiere", ms);
  }

  /**
   * setze Lautstärke auf
   * @param {number} volume
   */
  setVolume(volume) {
    this.notSupported("Musik.setzeLautstärkeAuf", volume);
  }

  /**
   * alle Soundeffekte anhalten
   */
  stopAllSounds() {
    this.notSupported("Musik.alleSoundeffekteAnhalten");
  }

  /**
   * ändere das Tempo um
   * @param {number} bpm
   */
  changeTempoBy(bpm) {
    this.notSupported("Musik.ändereDasTempoUm", bpm);
  }

  /**
   * ändere das Tempo auf
   * @param {number} bpm
   */
  setTempo(bpm) {
    this.notSupported("Musik.ändereDasTempoAuf", bpm);
  }

  /**
   * Schlag
   * @param {BeatFraction} fraction
   */
  beat(fraction) {
    this.notSupported("Musik.schlag", fraction.toString());
  }

  /**
   * Tempo (bpm)
   */
  tempo() {
    this.notSupported("Musik.tempo");
  }

  /**
   * beginne Melodie und wiederhole
   * @param {String[]} melodyArray buildInMelody
   * @param {MelodyOptions} options
   */
  startMelody(melodyArray, options) {
    this.notSupported(
      "Musik.beginneMelodie",
      melodyArray.toString(),
      options.toString()
    );
  }

  /**
   * halte Melodie an
   * @param {MelodyStopOptions} options
   */
  stopMelody(options) {
    this.notSupported("Musik.halteMelodieAn", options.toString());
  }
}
