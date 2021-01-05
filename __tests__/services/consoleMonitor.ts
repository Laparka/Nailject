import Monitor from "../interfaces/monitor";

export default class ConsoleMonitor<TClass> implements Monitor<TClass> {
    onAfterCall() {
        return;
    }

    onBeforeCall() {
        return;
    }

}