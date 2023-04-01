import BasicMapper from "@/compositions/makeCodeMapper/BasicMapper";
import InputMapper from "@/compositions/makeCodeMapper/InputMapper";
import MusicMapper from "@/compositions/makeCodeMapper/MusicMapper";
import LedMapper from "@/compositions/makeCodeMapper/LedMapper";
import RadioMapper from "@/compositions/makeCodeMapper/RadioMapper";
import LoopsMapper from "@/compositions/makeCodeMapper/LoopsMapper";
import LoiMvMapper from "@/compositions/makeCodeMapper/LoiMvMapper";
import I2cLcdMapper from "@/compositions/makeCodeMapper/I2cLcdMapper";
import NeopixelMapper from "@/compositions/makeCodeMapper/NeopixelMapper";
import BasicSimulator from "@/compositions/simulator/BasicSimulator";
import InputSimulator from "@/compositions/simulator/InputSimulator";
import MusicSimulator from "@/compositions/simulator/MusicSimulator";
import RadioSimulator from "@/compositions/simulator/RadioSimulator";
import LedSimulator from "@/compositions/simulator/LedSimulator";
import LoopsSimulator from "@/compositions/simulator/LoopsSimulator";
import LoiMvSimulator from "@/compositions/simulator/LoiMvSimulator";
import I2cLcdSimulator from "@/compositions/simulator/I2cLcdSimulator";
import NeopixelSimulator from "@/compositions/simulator/NeopixelSimulator";

export default class Simulation {

    _vehicle;
    _logArea;

    constructor(vehicle, logArea) {
        this._vehicle = vehicle;
        this._logArea = logArea;
    }

    /**
     * Lade Mapper, damit alle Befehle damit abfangen zu können. Die Konstanten müssen so benannt sein, dass sie dem Präfix aus MakeCode entsprechen.
     * Initialisiere Simulation und führe anschließend den Code aus.
     * Achtung: Sicherheitsrisiko
     */
    start() {
        //TODO while isRunning
        //TODO escape entrypoint oder als event verarbeiten
        //FIXME Aufruf später mit try/catch

        const basic = new BasicMapper(new BasicSimulator(this._vehicle, this._logArea));
        const input = new InputMapper(new InputSimulator(this._vehicle));
        const music = new MusicMapper(new MusicSimulator(this._vehicle));
        const led = new LedMapper(new LedSimulator(this._vehicle));
        const radio = new RadioMapper(new RadioSimulator(this._vehicle));
        const loops = new LoopsMapper(new LoopsSimulator(this._vehicle));
        const LOI_MV = new LoiMvMapper(new LoiMvSimulator(this._vehicle));
        const I2C_LCD1602 = new I2cLcdMapper(new I2cLcdSimulator(this._vehicle, this._logArea));
        const neopixel = new NeopixelMapper(new NeopixelSimulator(this._vehicle));
        this.useVariable(basic, input, music, led, radio, loops, LOI_MV, I2C_LCD1602, neopixel);

        this._vehicle.previousStartPose = this._vehicle.pose;//TODO wohin auslagern?
        this._vehicle.simulationStartTime = Date.now();

        eval(this._vehicle.program);
    }

    /**
     * Damit die Mapper nicht als "unused variables" gelten und der Code kompiliert
     */
    useVariable(...mapper) {
        return mapper
    }
}

/**
 * Die benötigten Enums, damit alles definiert ist, was im auszuführenden Code referenziert werden kann.
 */

/*
BasicSimulator
 */

export const DigitalPin = {
    P0: 100,
    P1: 101,
    P2: 102,
    P3: 103,
    P4: 104,
    P5: 105,
    P6: 106,
    P7: 107,
    P8: 108,
    P9: 109,
    P10: 110,
    P11: 111,
    P12: 112,
    P13: 113,
    P14: 114,
    P15: 115,
    P16: 116,
    P19: 119,
    P20: 120,
}

export const AnalogPin = {
    P0: 100,
    P1: 101,
    P2: 102,
    P3: 103,
    P4: 104,
    P10: 110,
    P5: 105,
    P6: 106,
    P7: 107,
    P8: 108,
    P9: 109,
    P11: 111,
    P12: 112,
    P13: 113,
    P14: 114,
    P15: 115,
    P16: 116,
    P19: 119,
    P20: 120,
}

export const IconNames = {
    Heart: 0,
    SmallHeart: 1,
    Yes: 2,
    No: 3,
    Happy: 4,
    Sad: 5,
    Confused: 6,
    Angry: 7,
    Asleep: 8,
    Surprised: 9,
    Silly: 10,
    Fabulous: 11,
    Meh: 12,
    TShirt: 13,
    Rollerskate: 14,
    Duck: 15,
    House: 16,
    Tortoise: 17,
    Butterfly: 18,
    StickFigure: 19,
    Ghost: 20,
    Sword: 21,
    Giraffe: 22,
    Skull: 23,
    Umbrella: 24,
    Snake: 25,
    Rabbit: 26,
    Cow: 27,
    QuarterNote: 28,
    EigthNote: 29,
    Pitchfork: 30,
    Target: 31,
    Triangle: 32,
    LeftTriangle: 33,
    Chessboard: 34,
    Diamond: 35,
    SmallDiamond: 36,
    Square: 37,
    SmallSquare: 38,
    Scissors: 39,
}

export const ArrowNames = {
    North: 0, NorthEast: 1, East: 2, SouthEast: 3, South: 4, SouthWest: 5, West: 6, NorthWest: 7
}

/*
InputMapper
 */

export const Button = {
    A: 1, B: 2, AB: 3,
}

export const Gesture = {
    Shake: 11,
    LogoUp: 1,
    LogoDown: 2,
    ScreenUp: 5,
    ScreenDown: 6,
    TiltLeft: 3,
    TiltRight: 4,
    FreeFall: 7,
    ThreeG: 8,
    SixG: 9,
    EightG: 10,
}


export const TouchPin = {
    P0: 100, P1: 101, P2: 102,
}

export const Dimension = {
    X: 0, Y: 1, Z: 2, Strength: 3
}

export const Rotation = {
    Pitch: 0, Roll: 1
}

export const AcceleratorRange = {
    OneG: 1, TwoG: 2, FourG: 4, EightG: 8
}

/*
MusicMapper
 */

export const MusicEvent = {
    MelodyNotePlayed: 1,
    MelodyStarted: 2,
    MelodyEnded: 3,
    MelodyRepeated: 4,
    BackgroundMelodyNotePlayed: 1 | 0xf0,
    BackgroundMelodyStarted: 2 | 0xf0,
    BackgroundMelodyEnded: 3 | 0xf0,
    BackgroundMelodyRepeated: 4 | 0xf0,
    BackgroundMelodyPaused: 5 | 0xf0,
    BackgroundMelodyResumed: 6 | 0xf0
}

export const BeatFraction = {
    Whole: 1, Half: 2, Quarter: 4, Eighth: 8, Sixteenth: 16, Double: 32, Breve: 64
}

export const Melodies = {
    Dadadadum: 0,
    Entertainer: 1,
    Prelude: 2,
    Ode: 3,
    Nyan: 4,
    Ringtone: 5,
    Funk: 6,
    Blues: 7,
    Birthday: 8,
    Wedding: 9,
    Funeral: 10,
    Punchline: 11,
    Baddy: 12,
    Chase: 13,
    BaDing: 14,
    Wawawawaa: 15,
    JumpUp: 16,
    JumpDown: 17,
    PowerUp: 18,
    PowerDown: 19
}

export const MelodyOptions = {
    Once: 1, Forever: 2, OnceInBackground: 4, ForeverInBackground: 8
}

export const MelodyStopOptions = {
    All: 1 | 4, Foreground: 1, Background: 4
}

/*
LED
 */

export const DisplayMode = {
    BlackAndWhite: 0, Greyscale: 1,
}

/*
RadioMapper
 */

export const RadioPacketProperty = {
    SignalStrength: 2, Time: 0, SerialNumber: 1
};

export const EventBusSource = {
    MICROBIT_ID_BUTTON_A: 1,
    MICROBIT_ID_BUTTON_B: 2,
    MICROBIT_ID_BUTTON_AB: 3,
    MICROBIT_ID_RADIO: 9,
    MICROBIT_ID_GESTURE: 13,
    MICROBIT_ID_ACCELEROMETER: 5,
    MICROBIT_ID_IO_P0: 100,
    MICROBIT_ID_IO_P1: 101,
    MICROBIT_ID_IO_P2: 102,
    MICROBIT_ID_IO_P3: 103,
    MICROBIT_ID_IO_P4: 104,
    MICROBIT_ID_IO_P5: 105,
    MICROBIT_ID_IO_P6: 106,
    MICROBIT_ID_IO_P7: 107,
    MICROBIT_ID_IO_P8: 108,
    MICROBIT_ID_IO_P9: 109,
    MICROBIT_ID_IO_P10: 110,
    MICROBIT_ID_IO_P11: 111,
    MICROBIT_ID_IO_P12: 112,
    MICROBIT_ID_IO_P13: 113,
    MICROBIT_ID_IO_P14: 114,
    MICROBIT_ID_IO_P15: 115,
    MICROBIT_ID_IO_P16: 116,
    MICROBIT_ID_IO_P19: 119,
    MICROBIT_ID_IO_P20: 120,
    MES_DEVICE_INFO_ID: 1103,
    MES_SIGNAL_STRENGTH_ID: 1101,
    MES_DPAD_CONTROLLER_ID: 1104,
    MES_BROADCAST_GENERAL_ID: 2000
}

export const EventBusValue = {
    MICROBIT_EVT_ANY: 0,
    MICROBIT_BUTTON_EVT_DOWN: 1,
    MICROBIT_BUTTON_EVT_UP: 2,
    MICROBIT_BUTTON_EVT_CLICK: 3,
    MICROBIT_RADIO_EVT_DATAGRAM: 1,
    MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE: 1,
    MICROBIT_PIN_EVT_RISE: 2,
    MICROBIT_PIN_EVT_FALL: 3,
    MICROBIT_PIN_EVT_PULSE_HI: 4,
    MICROBIT_PIN_EVT_PULSE_LO: 5,
    MES_ALERT_EVT_ALARM1: 6,
    MES_ALERT_EVT_ALARM2: 7,
    MES_ALERT_EVT_ALARM3: 8,
    MES_ALERT_EVT_ALARM4: 9,
    MES_ALERT_EVT_ALARM5: 10,
    MES_ALERT_EVT_ALARM6: 11,
    MES_ALERT_EVT_DISPLAY_TOAST: 1,
    MES_ALERT_EVT_FIND_MY_PHONE: 5,
    MES_ALERT_EVT_PLAY_RINGTONE: 4,
    MES_ALERT_EVT_PLAY_SOUND: 3,
    MES_ALERT_EVT_VIBRATE: 2,
    MES_CAMERA_EVT_LAUNCH_PHOTO_MODE: 1,
    MES_CAMERA_EVT_LAUNCH_VIDEO_MODE: 2,
    MES_CAMERA_EVT_START_VIDEO_CAPTURE: 4,
    MES_CAMERA_EVT_STOP_PHOTO_MODE: 6,
    MES_CAMERA_EVT_STOP_VIDEO_CAPTURE: 5,
    MES_CAMERA_EVT_STOP_VIDEO_MODE: 7,
    MES_CAMERA_EVT_TAKE_PHOTO: 3,
    MES_CAMERA_EVT_TOGGLE_FRONT_REAR: 8,
    MES_DEVICE_DISPLAY_OFF: 5,
    MES_DEVICE_DISPLAY_ON: 6,
    MES_DEVICE_GESTURE_DEVICE_SHAKEN: 4,
    MES_DEVICE_INCOMING_CALL: 7,
    MES_DEVICE_INCOMING_MESSAGE: 8,
    MES_DEVICE_ORIENTATION_LANDSCAPE: 1,
    MES_DEVICE_ORIENTATION_PORTRAIT: 2,
    MES_DPAD_BUTTON_1_DOWN: 9,
    MES_DPAD_BUTTON_1_UP: 10,
    MES_DPAD_BUTTON_2_DOWN: 11,
    MES_DPAD_BUTTON_2_UP: 12,
    MES_DPAD_BUTTON_3_DOWN: 13,
    MES_DPAD_BUTTON_3_UP: 14,
    MES_DPAD_BUTTON_4_DOWN: 15,
    MES_DPAD_BUTTON_4_UP: 16,
    MES_DPAD_BUTTON_A_DOWN: 1,
    MES_DPAD_BUTTON_A_UP: 2,
    MES_DPAD_BUTTON_B_DOWN: 3,
    MES_DPAD_BUTTON_B_UP: 4,
    MES_DPAD_BUTTON_C_DOWN: 5,
    MES_DPAD_BUTTON_C_UP: 6,
    MES_DPAD_BUTTON_D_DOWN: 7,
    MES_DPAD_BUTTON_D_UP: 8,
    MES_REMOTE_CONTROL_EVT_FORWARD: 6,
    MES_REMOTE_CONTROL_EVT_NEXTTRACK: 4,
    MES_REMOTE_CONTROL_EVT_PAUSE: 2,
    MES_REMOTE_CONTROL_EVT_PLAY: 1,
    MES_REMOTE_CONTROL_EVT_PREVTRACK: 5,
    MES_REMOTE_CONTROL_EVT_REWIND: 7,
    MES_REMOTE_CONTROL_EVT_STOP: 3,
    MES_REMOTE_CONTROL_EVT_VOLUMEDOWN: 9,
    MES_REMOTE_CONTROL_EVT_VOLUMEUP: 8,
}

/*
NeopixelMapper
 */

export const NeoPixelColors = {
    Red: 0xFF0000,
    Orange: 0xFFA500,
    Yellow: 0xFFFF00,
    Green: 0x00FF00,
    Blue: 0x0000FF,
    Indigo: 0x4b0082,
    Violet: 0x8a2be2,
    Purple: 0xFF00FF,
    White: 0xFFFFFF,
    Black: 0x000000
}

export const NeoPixelMode = {
    RGB: 1, RGBW: 2, RGB_RGB: 3
}
