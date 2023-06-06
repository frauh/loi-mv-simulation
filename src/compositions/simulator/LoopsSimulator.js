import LoopsMapper from "@/compositions/makeCodeMapper/LoopsMapper";
import { clock } from "@/compositions/Consts";

export default class LoopsSimulator extends LoopsMapper {
  /**
   * alle ... ms
   * Entrypoint vgl. Parser
   * @param {number} interval
   * @param {function} handler
   * @param {number} pause
   */
  everyInterval(interval, handler, pause) {
    setInterval(handler, interval + pause + clock);
  }
}
