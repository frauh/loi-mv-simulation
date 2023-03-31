import Mapper from "@/compositions/makeCodeMapper/Mapper";
import {Rotation} from "@/compositions/Interpreter";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Eingabe' für micro:bit V1
 */
export default class InputMapper extends Mapper {

    /**
     * Wenn Knopf geklickt
     * @param button Button
     * @param handler function()
     */
    onButtonPressed(button, handler) {
        //TODO entrypoint
        this.notSupported("Eingabe.wennKnopfGeklickt", button, handler)
    }

    /**
     * Wenn micro:bit bewegt wird
     * @param gesture Gesture
     * @param handler function()
     */
    onGesture(gesture, handler) {
        //TODO entrypoint
        this.notSupported("Eingabe.wennBewegt", gesture, handler)
    }

    /**
     * Wenn Pin gedrückt
     * @param name TouchPin
     * @param handler function()
     */
    onPinPressed(name, handler) {
        //TODO entrypoint
        this.notSupported("Eingabe.wennPinGedrückt", name, handler);
    }

    /**
     * Wenn Pin losgelassen
     * @param name TouchPin
     * @param handler function()
     */
    onPinReleased(name, handler) {
        //TODO entrypoint
        this.notSupported("Eingabe.wennPinLosgelassen", name, handler);
    }

    /**
     * Knopf ist geklickt
     * @param button Button
     */
    buttonIsPressed(button) {
        this.notSupported("Eingabe.knopfIstGeklickt", button)
    }

    /**
     * Beschleunigung (mg)
     * @param dimension Dimension
     */
    acceleration(dimension) {
        this.notSupported("Eingabe.beschleunigung", dimension)
    }

    /**
     * Pin ist gedrückt
     * @param name TouchPin
     */
    pinIsPressed(name) {
        this.notSupported("Eingabe.pinIstGedrückt", name)
    }

    /**
     * Lichtstärke
     */
    lightLevel() {
        this.notSupported("Eingabe.lichtstärke")
    }

    /**
     * Kompassausrichtung (°)
     */
    compassHeading() {
        return this.#simulateRotation();
    }

    /**
     * Temperatur (C°)
     */
    temperature() {
        this.notSupported("Eingabe.temperatur")
    }

    /**
     * Bewegung
     * @param gesture Gesture
     */
    isGesture(gesture) {
        this.notSupported("Eingabe.bewegung", gesture);
    }

    /**
     * Rotation (°)
     * @param kind Rotation
     */
    rotation(kind) {
        if (kind === Rotation.Pitch) {
            return this.#simulateRotation();
        } else {
            this.notSupported("Eingabe.rotation", "Rotation.Roll");
            return 0;
        }
    }

    /**
     * Magnetkraft (µT)
     * @param dimension Dimension
     */
    magneticForce(dimension) {
        this.notSupported("Eingabe.magnetkraft", dimension);
    }

    /**
     * Laufzeit (ms)
     */
    runningTime() {
        return this.#simulateRunningTime();
    }

    /**
     * Laufzeit (micros)
     */
    runningTimeMicros() {
        return this.#simulateRunningTime() / 1000;
    }

    /**
     * Kompass kalibrieren
     */
    calibrateCompass() {
        // nothing to do
    }

    /**
     * setze Bewegungsmesser auf
     * @param range AcceleratorRange
     */
    setAccelerometerRange(range) {
        this.notSupported("Eingabe.setzeBewegungsmesser", range);
    }

    #simulateRotation() {
        return this._simulator.pose.theta * (180/Math.PI) + 90;
    }

    #simulateRunningTime() {
        return Date.now() - this._simulator.simulationStartTime;
    }
}