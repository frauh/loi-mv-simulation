export default function parseProgramCode(code) {
    let program = {start: "", functions: []}
    let split = code.split("})\n")
    if (!split[split.length - 1]) {
        split.pop();
    }
    split.forEach(line => {
        if (!startsAsFunction(line)) {
            let newStart = line.slice(0, line.search("\n.*function") + 1);
            program.start = program.start.concat(newStart);
            line = line.slice(newStart.length);
        }
        program.functions.push(line.concat("})\n"));
    });
    return program
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
}