import Mapper from "@/compositions/makeCodeMapper/Mapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Musik' für micro:bit V1
 */
export default class MusicMapper extends Mapper {

    /**
     * Wenn Musik
     * @param value MusicEvent
     * @param handler function()
     * @returns {*}
     */
    onEvent(value, handler) {
        //TODO entrypoint
        this.notSupported("Musik.wennMusik", value, handler);
    }

    /**
     * spiele Melodie im Tempo
     * @param melody string
     * @param tempo number
     */
    playMelody(melody, tempo) {
        this.notSupported("Musik.spieleMelodie", melody, tempo);
    }

    /**
     * spiele Note für Dauer
     * @param frequency number
     * @param ms number
     */
    playTone(frequency, ms) {
        this.notSupported("Musik.spieleNote", frequency, ms);
    }

    /**
     * Note
     * @param frequency number
     */
    ringTone(frequency) {
        this.notSupported("Musik.Note", frequency);
    }

    /**
     * pausiere
     * @param ms number
     */
    rest(ms) {
        this.notSupported("Musik.pausiere", ms);
    }

    /**
     * setze Lautstärke auf
     * @param volume number
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
     * @param bpm number
     */
    changeTempoBy(bpm) {
        this.notSupported("Musik.ändereDasTempoUm", bpm);
    }

    /**
     * ändere das Tempo auf
     * @param bpm number
     */
    setTempo(bpm) {
        this.notSupported("Musik.ändereDasTempoAuf", bpm);
    }

    /**
     * Schlag
     * @param fraction BeatFraction
     */
    beat(fraction) {
        this.notSupported("Musik.schlag", fraction);
    }

    /**
     * Tempo (bpm)
     */
    tempo() {
        this.notSupported("Musik.tempo");
    }

    /**
     * beginne Melodie und wiederhole
     * @param melodyArray buildInMelody
     * @param options MelodyOptions
     */
    startMelody(melodyArray, options) {
        this.notSupported("Musik.beginneMelodie", melodyArray, options);
    }

    /**
     * halte Melodie an
     * @param options MelodyStopOptions
     */
    stopMelody(options) {
        this.notSupported("Musik.halteMelodieAn", options)
    }

    /**
     *
     * @param melody Melodies
     */
    builtInMelody(melody) {
        return [melody.toString()];
    }
}