import * as path from 'path';
import Monitor from "./interfaces/monitor";
import ConsoleMonitor from "./services/consoleMonitor";
import { Logger } from "./interfaces/logger";
import * as L from "./interfaces/logger";
import ConsoleLogger from "./services/consoleLogger";
import NullLogger from "./services/nullLogger";
import { ContainerBuilder as C } from '../api/containerBuilder';
import * as D from '../api/dependenciesRegistration';
import { TYPES } from './services/types';
import { TwoGenerics as ITwoGeneric, TwoGenericsImpl } from './interfaces/twoGenerics';

export default class Module implements D.DependenciesRegistration {
    register(containerBuilder: C): void {
        containerBuilder.addSingleton<Monitor<Logger>, ConsoleMonitor<ConsoleLogger>>(TYPES.Monitor);
        containerBuilder.addSingleton<Monitor<string>, ConsoleMonitor<number>>(TYPES.Monitor);
        containerBuilder.addTransient<Logger, ConsoleLogger>(TYPES.Logger);
        containerBuilder.addTransient<Logger, NullLogger>(TYPES.Logger);
        containerBuilder.addSingleton<ITwoGeneric<Monitor<L.Logger>, ConsoleMonitor<ConsoleLogger>>, TwoGenericsImpl<Monitor<Logger>, ConsoleMonitor<ConsoleLogger>>>(TYPES.TwoGenerics);
    }

    onAfterCall(): void {
    }

    onBeforeCall(): void {
    }
}