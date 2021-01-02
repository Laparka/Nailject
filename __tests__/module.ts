import Monitor from "./interfaces/monitor";
import ConsoleMonitor from "./services/consoleMonitor";
import { Logger as LGR } from "./interfaces/logger";
import * as L from "./interfaces/logger";
import ConsoleLogger from "./services/consoleLogger";
import NullLogger from "./services/nullLogger";
import { ContainerBuilder as C } from '../api/containerBuilder';
import * as D from '../api/dependenciesRegistration';
import { TwoGenerics as ITwoGeneric, TwoGenericsImpl } from './interfaces/twoGenerics';

export default class Module implements D.DependenciesRegistration {
    register(containerBuilder: C): void {
        containerBuilder.addSingleton<Monitor<LGR>, ConsoleMonitor<ConsoleLogger>>();
        containerBuilder.addSingleton<Monitor<string>, ConsoleMonitor<number>>();
        containerBuilder.addTransient<L.Logger, ConsoleLogger>();
        containerBuilder.addTransient<LGR, NullLogger>();
        containerBuilder.addSingleton<ITwoGeneric<Monitor<L.Logger>, ConsoleMonitor<ConsoleLogger>>, TwoGenericsImpl<Monitor<LGR>, ConsoleMonitor<ConsoleLogger>>>();
    }
}