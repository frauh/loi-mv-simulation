import MakeCodeMapper from "@/compositions/makeCodeMapper/MakeCodeMapper";

/**
 * Alle MakeCode Funktionen aus dem Reiter 'Grundlagen' für micro:bit V1
 * 'Beim Start' wird nicht beachtet, da dieses im Javascript an erster Stelle steht
 */
export default class Basic extends MakeCodeMapper {

    /**
     * dauerhaft
     * @param handler function()
     */
    forever(handler) {
        //TODO entrypoint
        this.notSupported("Grundlagen.dauerhaft", handler)
    }

    /**
     * zeige Zahl
     * @param value number
     */
    showNumber(value) {
        this.#simulateLEDs(value)
    }

    /**
     * zeige LEDs
     * @param leds string
     */
    showLeds(leds) {
        this.#simulateLEDs(leds)
    }

    /**
     * zeige Symbol
     * @param icon IconNames
     */
    showIcon(icon) {
        this.#simulateLEDs(this.#mapIconNames(icon.split(".")[1]));
    }

    /**
     * zeige Text
     * @param text string
     */
    showString(text) {
        this.#simulateLEDs(text);
    }

    /**
     * Bildschirminhalt löschen
     */
    clearScreen() {
        // nothing to do
    }

    /**
     * pausiere (ms)
     * @param ms number
     */
    async pause(ms) { //TODO ggf. async und await
        console.log("pause", ms)
        await this.#simulatePause(ms);
    }

    /**
     * zeige Pfeil
     * @param direction number
     */
    showArrow(direction) {
        this.#simulateLEDs(this.#mapArrowName(direction.split(".")[1]));
    }

    #simulateLEDs(msg) {
        //TODO log
        console.log(msg)
    }

    #simulatePause(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     *
     * @param iconName IconNames
     * @returns {string}
     */
    #mapIconNames(iconName) {
        switch (iconName) {
            case 0: // "Heart"
            case 1: // "SmallHeart"
                return "<i class='fas fa-heart'/>";
            case 2: // "Yes"
                return "<i class='fas fa-check'/>";
            case 3: // "No"
                return "<i class='fas fa-xmark'/>";
            case 4: // "Happy"
                return "<i class='fas fa-face-smile'/>";
            case 5: // "Sad"
                return "<i class='fas fa-face-frown'/>";
            case 6: // "Confused"
                return "<i class='fas fa-face-grimace'/>";
            case 7: // "Angry"
                return "<i class='fas fa-face-angry'/>";
            case 8: // "Asleep"
                return "<i class='fas fa-face-meh-blank'/>";
            case 9: // "Surprised"
                return "<i class='fas fa-face-surprise'/>";
            case 10: // "Silly"
                return "<i class='fas fa-face-sad-tear'/>";
            case 11: // "Fabulous"
                return "<i class='fas fa-face-grin-stars'/>";
            case 12: // "Meh"
                return "<i class='fas fa-face-meh'/>";
            case 13: // "TShirt"
                return "<i class='fas fa-shirt'/>";
            case 16: // "House"
                return "<i class='fas fa-house'/>";
            case 19: // "StickFigure":
                return "<i class='fas fa-child-reaching'/>";
            case 20: // "Ghost"
                return "<i class='fas fa-ghost'/>";
            case 23: // "Skull"
                return "<i class='fas fa-skull'/>";
            case 24: // "Umbrella"
                return "<i class='fas fa-umbrella'/>";
            case 27: // "Cow"
                return "<i class='fas fa-cow'/>";
            case 28: // "QuarterNote"
            case 29: // "EigthNote"
                return "<i class='fas fa-music'/>";
            case 30: // "Pitchfork"
                return "<i class='fas fa-y'/>";
            case 31: // "Target"
                return "<i class='fas fa-circle-dot'/>";
            case 32: // "Triangle"
            case 33: // "LeftTriangle"
                return "<i class='fas fa-caret-left'/>";
            case 34: // "Chessboard"
                return "<i class='fas fa-chess-board'/>";
            case 35: // "Diamond"
            case 36: // "SmallDiamond"
                return "<i class='fas fa-diamond'/>";
            case 37: // "Square"
            case 38: // "SmallSquare"
                return "<i class='fas fa-square'/>";
            case 39: // "Scissors"
                return "<i class='fas fa-scissors'/>";
            default:
                return "Icon: " + iconName;
        }
    }

    /**
     *
     * @param arrowName ArrowNames
     * @returns {string}
     */
    #mapArrowName(arrowName) {
        switch (arrowName) {
            case 0: // "North"
                return "<i class='fas fa-arrow-up'/>";
            case 1: // "NorthEast"
                return [this.#mapArrowName("North"), this.#mapArrowName("East")].join();
            case 2: // "East"
                return "<i class='fas fa-arrow-right'/>";
            case 3: // "SouthEast"
                return [this.#mapArrowName("South"), this.#mapArrowName("East")].join();
            case 4: // "South"
                return "<i class='fas fa-arrow-down'/>";
            case 5: // "SouthWest"
                return [this.#mapArrowName("South"), this.#mapArrowName("West")].join();
            case 6: // "West"
                return "<i class='fas fa-arrow-left'/>";
            case 7: // "NorthWest"
                return [this.#mapArrowName("North"), this.#mapArrowName("West")].join();
            default:
                return "Pfeil " + arrowName;
        }
    }
}