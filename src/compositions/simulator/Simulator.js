export default class Simulator {
    /**
     * sendet eine Nachricht vom Worker zurück
     * @param key WorkerMessageKey
     * @param value
     */
    commit(key, value) {
        self.postMessage({
            key: key, value: value,
        });
    }
}
