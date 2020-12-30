import Monitor from "../interfaces/monitor";

export default class ConsoleMonitor<TClass> implements Monitor<TClass> {
    onAfterCall() {
        console.log(`Call is finished`);
    }

    onBeforeCall() {
        console.log("Starting the call");
    }

}