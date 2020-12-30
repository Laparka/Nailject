import * as path from 'path';
import {CompiledServiceProvider as P} from '../api/serviceProvider';
import Monitor from "./interfaces/monitor";
import ConsoleMonitor from "./services/consoleMonitor";
import Logger from "./interfaces/logger";
import ConsoleLogger from "./services/consoleLogger";
import NullLogger from "./services/nullLogger";
import { ContainerBuilder as C } from '../api/containerBuilder';
import * as D from '../api/dependenciesRegistration';
import { TYPES } from './services/types';

export default class Module implements D.DependenciesRegistration, Monitor<C> {
    register(containerBuilder: C): void {
        containerBuilder.addSingleton<Monitor<Logger>, ConsoleMonitor<ConsoleLogger>>(TYPES.Monitor);
        containerBuilder.addTransient<Logger, ConsoleLogger>(TYPES.Logger);
        containerBuilder.addTransient<Logger, NullLogger>(TYPES.Logger);
        containerBuilder.addTransient<Monitor<Module>, Module>(TYPES.Monitor);
    }

    onAfterCall(): void {
    }

    onBeforeCall(): void {
    }
}