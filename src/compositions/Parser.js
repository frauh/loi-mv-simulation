export default function parseProgramCode(code) {
    let program = separateStartFrom(code);
    program = doReplacements(program, searchAndReplacePause);
    return program;
}

function doReplacements(program, handler) {
    program.start = handler(program.start);
    for (let functionsKey in program.functions) {
        program.functions[functionsKey] = handler(program.functions[functionsKey]);
    }
    return program;
}

/**
 * trennt nach "beim Start" und anderen möglichen Anfängen vom Code (z.B. dauerhaft, wenn Knopf gedrückt)
 * @param code
 * @returns {{functions: string[], start: string}}
 */
function separateStartFrom(code) {
    let program = {start: "", functions: []};
    let split = code.split("})\n");
    if (!split[split.length - 1]) {
        split.pop();
    }
    if (split.length === 1) {
        if (!startsAsFunction(code)) {
            program.start = code;
        } else {
            program.functions.push(code);
        }
        return program;
    }
    split.forEach((line) => {
        if (!startsAsFunction(line)) {
            let newStart = line.slice(0, line.search("\n.*function") + 1);
            program.start = program.start.concat(newStart);
            line = line.slice(newStart.length);
        }
        program.functions.push(line.concat("})\n"));
    });
    return program;
}

/**
 * ersetzt "basic.pause(<ms>)..." durch "setTimeout(<ms>, {...})", damit entsprechend pausiert wird
 * @param code
 * @return string
 */
function searchAndReplacePause(code) {
    let pauseString = "basic.pause(";
    let pausePosition = code.indexOf(pauseString);
    if (pausePosition === -1) {
        return code;
    }
    let result = [];
    result.push(code.slice(0, pausePosition), "setTimeout(() => {\n");
    code = code.slice(pausePosition + pauseString.length);
    let ms = code.slice(0, code.indexOf(")"));
    let end = findEndOfPause(code.slice(ms.length + 2));
    result.push(searchAndReplacePause(end.insidePause), "}, ", ms, ")\n", searchAndReplacePause(end.afterPause));
    return result.join("");
}

function findEndOfPause(code) {
    let insidePause;
    let afterPause;
    let open = code.indexOf("{");
    let close = code.indexOf("}");
    if (open === close) {
        // beide -1: keine Verzweigungen, Schleifen oder Funktionen
        insidePause = code;
        afterPause = "";
    } else if (open === -1 && close >= 0) {
        // pause befand sich innerhalb einer {}, die damit geschlossen wird
        insidePause = code.slice(0, close);
        afterPause = code.slice(close);
    } else {
        // Klammer geht auf und zu, nach der Pause kommen also Verzweigungen, Schleifen oder Funktionen
        let newEnd = findEndOfPause(code.slice(close + 1));
        insidePause = code.slice(0, close + 1).concat(newEnd.insidePause);
        afterPause = newEnd.afterPause;
    }
    return {insidePause, afterPause};
}

function startsAsFunction(code) {
    for (let entrypoint in entrypoints) {
        if (code.startsWith(entrypoints[entrypoint])) {
            return true;
        }
    }
    return false;
}

const entrypoints = {
    dauerhaft: "basic.forever",
    wennKnopfGeklickt: "input.onButtonPressed",
    wennBewegt: "input.onGesture",
    wennPinGedrueckt: "input.onPinPressed",
    wennPinLosgelassen: "input.onPinReleased",
    wennMusik: "music.onEvent",
    wennZahlEmpfangen: "radio.onReceivedNumber",
    wennWertepaarEmpfangen: "radio.onReceivedString",
    WennTextEmpfangen: "radio.onReceivedValue",
    alleMs: "loops.everyInterval",
};
