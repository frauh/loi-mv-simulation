import { LZMA } from "lzma/src/lzma-d";

const MAIN_TS = "main.ts";

/**
 * Liest die hochgeladene Datei ein, um daraus den in MakeCode geschriebenen Code zu extratieren
 * @param file direkt aus dem InputMapper als '.hex'
 * @returns {Promise<String>} typescript
 */
export default function readMakeCodeFileAsynchronous(file) {
  return new Promise((resolve) => {
    if (!file) {
      console.error("Keine Datei zum Hochladen gefunden.");
      resolve("");
    }
    if (file.name.endsWith("hex")) {
      readFileAsBufferAsynchronous(file).then((data) => {
        readHexFile(data)
          .then((result) => resolve(result.source[MAIN_TS]))
          .catch((e) => console.error("Datei konnte nicht erkannt werden.", e));
      });
    } else {
      console.error("Kein passendes Dateiformat.");
      resolve("");
    }
  });
}

/**
 * FileReader liest die Datei ein
 * @param file
 * @returns {Promise<unknown>} Uint8Array
 */
function readFileAsBufferAsynchronous(file) {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onerror = () => resolve(null);
    fileReader.onload = () => resolve(new Uint8Array(fileReader.result));
    fileReader.readAsArrayBuffer(file);
  });
}

/**
 * Liest die Hex-Datei aus und sucht nach dem darin enthaltenen Code
 * @param byteArray Uint8Array
 * @returns {Promise<never>|Promise<{source: (string|string)}>|Promise<unknown>} Header und Inhalt getrennt
 */
function readHexFile(byteArray) {
  function promiseError(msg) {
    console.error(msg);
    return Promise.reject(new Error(msg));
  }

  let rawHexCode = { meta: String, text: Uint8Array };
  rawHexCode.meta = null;
  rawHexCode.text = null;

  if (byteArray[0] === 0x3a) {
    // prüfe auf Hexformat (check for colon)
    rawHexCode = extractCode(decodeFromUTF8Bytes(byteArray) || "");
  }
  if (!rawHexCode || !rawHexCode.meta || !rawHexCode.text) {
    return promiseError("Datei enthält keine Daten.");
  }

  let header = {
    compression: String,
    headerSize: Number,
    metaSize: Number,
    editor: String,
    target: String,
  };
  header = JSON.parse(rawHexCode.meta);

  if (!header) {
    return promiseError("Ungültige Datei.");
  } else if (header.compression === "LZMA") {
    return decompressLzmaAsynchronous(rawHexCode.text).then((result) => {
      if (!result) {
        return null;
      }
      let meta = result.slice(0, header.headerSize || header.metaSize || 0);
      let text = result.slice(meta.length);
      if (meta) {
        let values = null;
        if (JSON.parse(meta) != null) {
          values = JSON.parse(JSON.stringify(JSON.parse(meta)));
        }
        for (let key of Object.keys(JSON.parse(meta))) {
          header[key] = values[key];
        }
      }
      if (typeof text === "object") {
        text = JSON.stringify(text);
      }
      text = JSON.parse(text);
      if (!text) {
        return promiseError("Fehler beim Lesen des Programmcodes der Datei.");
      }

      return { meta: header, source: text };
    });
  } else if (header.compression) {
    return promiseError(
      "Kompression ${hd.compression} wird nicht unterstützt."
    );
  } else {
    return Promise.resolve({ source: decodeFromUTF8Bytes(rawHexCode.text) });
  }
}

/**
 * Übersetzt Hexadezimalcode der Datei, um diese weiterzuverarbeiten
 * Sucht nach dem Header, um diesen zuerst zu lesen, da darin das weitere Vorgehen festgelegt wird.
 * @param hexFile
 * @returns {undefined|{meta: (string|string), text: Uint8Array}}
 */
function extractCode(hexFile) {
  function swapBytes(string) {
    let result = "";
    let i = 0;
    for (; i < string.length; i += 2) {
      result = string[i] + string[i + 1] + result;
    }
    if (i !== string.length) {
      throw new Error("Failure while swapping bytes");
    }
    return result;
  }

  let metaLength = 0;
  let textLength = 0;
  let toGo = 0;
  let buffer = [];
  let pointer = 0;
  hexFile.split(/\r?\n/).forEach((line) => {
    let meta = /^:10....0[0E]41140E2FB82FA2BB(....)(....)(....)(....)(..)/.exec(
      line
    );
    if (meta) {
      metaLength = parseInt(swapBytes(meta[1]), 16);
      textLength = parseInt(swapBytes(meta[2]), 16);
      toGo = metaLength + textLength;
      buffer = new Uint8Array(toGo);
    } else if (toGo > 0) {
      meta = /^:10....0[0E](.*)(..)$/.exec(line);
      if (!meta) {
        return;
      }
      let k = meta[1];
      while (toGo > 0 && k.length > 0) {
        buffer[pointer++] = parseInt(k[0] + k[1], 16);
        k = k.slice(2);
        toGo--;
      }
    }
  });
  if (!buffer || !(toGo === 0 && pointer === buffer.length)) {
    return undefined;
  }
  let bufferMeta = new Uint8Array(metaLength);
  let bufferText = new Uint8Array(textLength);
  for (let i = 0; i < metaLength; ++i) {
    bufferMeta[i] = buffer[i];
  }
  for (let i = 0; i < textLength; ++i) {
    bufferText[i] = buffer[metaLength + i];
  }
  return {
    meta: decodeFromUTF8Bytes(bufferMeta),
    text: bufferText,
  };
}

/**
 * Decodiert utf8-bytes, sucht zuerst nach Sonderzeichen
 * @param binaryString
 * @returns {string}
 */
function decodeFromUTF8Bytes(binaryString) {
  if (!binaryString) {
    return "";
  }
  let escaped = "";
  for (let i = 0; i < binaryString.length; ++i) {
    let k = binaryString[i] & 0xff;
    if (k === 37 || k > 0x7f) {
      escaped += "%" + k.toString(16);
    } else {
      escaped += String.fromCharCode(k);
    }
  }
  return decodeURIComponent(escaped);
}

/**
 * Dekomprimiert mit dem LZM-Algorithmus
 * @param buffer
 * @returns {Promise<unknown>} String
 */
function decompressLzmaAsynchronous(buffer) {
  return new Promise((resolve) => {
    try {
      LZMA.decompress(buffer, (result, error) => {
        if (error) {
          console.error("Dekompression mit LZMA fehlgeschlagen");
        }
        resolve(error ? undefined : result);
      });
    } catch (e) {
      console.error("Dekompression mit LZMA fehlgeschlagen", e);
      resolve(undefined);
    }
  });
}
