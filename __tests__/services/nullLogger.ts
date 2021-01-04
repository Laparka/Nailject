import { Logger } from "../interfaces/logger";

export class NullLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
}