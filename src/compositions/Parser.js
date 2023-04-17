/**
 * Führt auf dem eingelesenen Javascriptcode Operationen durch.
 * Trennt unterschiedliche Codeblöcke voneinander und sucht nach besonderen Befehlen, die ersetzt werden müssen.
 * Fügt am Ende des Codes das Senden einer Nachricht ein, die der ausführende SimulationWorker.js an die Simulation.js sendet.
 * @param code
 * @return {{functions: [], start: string}}
 */
export default function parseProgramCode(code) {
  return doReplacements(separateStartFrom(code));
}

/**
 * trennt nach "beim Start" und anderen möglichen Anfängen vom Code (z.B. dauerhaft, wenn Knopf gedrückt)
 * @param code
 * @returns {{functions: {type: entryPoints, code: string, pause: number}[], start: string}}
 */
function separateStartFrom(code) {
  let program = { start: "", functions: [] };
  let split = code.concat("\n").split("})\n");
  if (!split[split.length - 1] || !split[split.length - 1].trim()) {
    split.pop();
  }
  split.forEach((line) => {
    let type = startsAsFunction(line);
    if (type) {
      program.functions.push({
        type: type,
        code: line.concat("})\n"),
        pause: 0,
      });
    } else {
      if (line.includes("function")) {
        let newStart = line.slice(0, line.search("\n.*function") + 1);
        program.start = program.start.concat(newStart);
        line = line.slice(newStart.length);
        const trim = line.trim();
        if (trim) {
          program.functions.push({
            type: startsAsFunction(trim),
            code: line.concat("})\n"),
            pause: 0,
          });
        }
      } else {
        program.start = line;
      }
    }
  });
  return program;
}

function doReplacements(program) {
  let result = { start: "", functions: [] };
  if (program.start) {
    result.start = searchAndReplacePause(
      program.start.concat(
        "self.postMessage({key: 'evalFinished', value: true})\n"
      )
    ).code;
  }
  for (let commands of program.functions) {
    const replacedPause = searchAndReplacePause(commands.code);
    switch (commands.type) {
      case entryPoints.dauerhaft:
      case entryPoints.alleMs:
        result.functions.push(
          addPauseValueToFunction(replacedPause.code, replacedPause.pause)
        );
        break;
      default:
        result.functions.push(replacedPause.code);
    }
  }
  return result;
}

/**
 * ersetzt "basic.pause(<ms>)..." durch "setTimeout({...}, <ms>)", damit entsprechend pausiert wird
 * @param code
 * @return {{code: string, pause: number}}
 */
function searchAndReplacePause(code) {
  let pauseString = "basic.pause(";
  let pausePosition = code.indexOf(pauseString);
  if (pausePosition === -1) {
    return { code: code, pause: 0 };
  }
  let result = [];
  result.push(code.slice(0, pausePosition), "setTimeout(() => {\n");
  code = code.slice(pausePosition + pauseString.length);
  let ms = code.slice(0, code.indexOf(")"));
  let end = findEndOfPause(code.slice(ms.length + 2));
  let inside = searchAndReplacePause(end.beforeEnd);
  let after = searchAndReplacePause(end.afterEnd);
  result.push(inside.code, "}, ", ms, ")\n", after.code);
  return {
    code: result.join(""),
    pause: Number(ms) + inside.pause + after.pause,
  };
}

function findEndOfPause(code) {
  let beforeEnd;
  let afterEnd;
  let open = code.indexOf("{");
  let close = code.indexOf("}");
  if (open === close) {
    // beide -1: keine Verzweigungen, Schleifen oder Funktionen
    beforeEnd = code;
    afterEnd = "";
  } else if (open === -1 && close >= 0) {
    // pause befand sich innerhalb einer {}, die damit geschlossen wird
    beforeEnd = code.slice(0, close);
    afterEnd = code.slice(close);
  } else {
    // Klammer geht auf und zu, nach der Pause kommen also Verzweigungen, Schleifen oder Funktionen
    let newEnd = findEndOfPause(code.slice(close + 1));
    beforeEnd = code.slice(0, close + 1).concat(newEnd.beforeEnd);
    afterEnd = newEnd.afterEnd;
  }
  return { beforeEnd: beforeEnd, afterEnd: afterEnd };
}

/**
 *
 * @param code
 * @returns {string}
 */
function startsAsFunction(code) {
  for (let key in entryPoints) {
    if (code.startsWith(entryPoints[key])) {
      return entryPoints[key];
    }
  }
  return "";
}

/**
 *
 * @param {string} code
 * @param {number} pause
 */
function addPauseValueToFunction(code, pause) {
  const index = code.lastIndexOf(")");
  return code.slice(0, index).concat(", ", pause.toString(), code.slice(index));
}

/**
 * Blöcke aus MakeCode, die einen Startpunkt darstellen.
 * "Beim Start" wird nicht beachtet, da es im Parser separat abgefangen wird.
 */
export const entryPoints = {
  dauerhaft: "basic.forever",
  wennKnopfGeklickt: "input.onButtonPressed",
  wennBewegt: "input.onGesture",
  wennPinGedruckt: "input.onPinPressed",
  wennPinLosgelassen: "input.onPinReleased",
  wennMusik: "music.onEvent",
  wennZahlEmpfangen: "radio.onReceivedNumber",
  wennWertepaarEmpfangen: "radio.onReceivedString",
  WennTextEmpfangen: "radio.onReceivedValue",
  alleMs: "loops.everyInterval",
};
