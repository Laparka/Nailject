import { Logger } from "../interfaces/logger";

export default class NullLogger implements Logger {
    log(message: string): void {
    }
}