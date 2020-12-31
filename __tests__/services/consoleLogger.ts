import { Logger } from "../interfaces/logger";
import Monitor from "../interfaces/monitor";

export default class ConsoleLogger implements Logger {
    private readonly _monitors: Monitor<ConsoleLogger>[];
    constructor(monitors: Monitor<ConsoleLogger>[]) {
        this._monitors = monitors;
    }

    log(message: string): void {
        this._monitors.forEach(x => x.onBeforeCall());
        console.log(message);
        this._monitors.forEach(x => x.onAfterCall());
    }
}