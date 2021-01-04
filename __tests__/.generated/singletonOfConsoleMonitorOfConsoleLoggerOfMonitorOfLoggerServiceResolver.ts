
    
import Monitor from './__tests__/interfaces/monitor';
    

    
        
import { Logger as LGR } from './__tests__/interfaces/logger';
        
    

    
import ConsoleMonitor from './__tests__/services/consoleMonitor';
    

    
import ConsoleLogger from './__tests__/services/consoleLogger';
    


export default class ConsoleMonitorOfConsoleLoggerOfMonitorOfLoggerSingletonServiceResolver extends SingletonServiceResolver<Monitor<LGR>> {
    doResolve(serviceProvider: ServiceProvider): Monitor<LGR> {
        const ctor: InstanceConstructor<ConsoleMonitor<ConsoleLogger>> = ConsoleMonitor<ConsoleLogger>;

        return new ctor();
    }
}