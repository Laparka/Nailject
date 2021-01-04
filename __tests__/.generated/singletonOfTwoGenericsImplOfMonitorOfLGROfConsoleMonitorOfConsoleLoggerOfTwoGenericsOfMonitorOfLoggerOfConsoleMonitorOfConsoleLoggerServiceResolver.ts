
    
        
import { TwoGenerics as ITwoGeneric } from './__tests__/interfaces/twoGenerics';
        
    

    
import Monitor from './__tests__/interfaces/monitor';
    

    
import * as L from './__tests__/interfaces/logger';
    

    
import ConsoleMonitor from './__tests__/services/consoleMonitor';
    

    
import ConsoleLogger from './__tests__/services/consoleLogger';
    

    
        
import { TwoGenericsImpl } from './__tests__/interfaces/twoGenerics';
        
    

    
        
import { Logger as LGR } from './__tests__/interfaces/logger';
        
    


export default class TwoGenericsImplOfMonitorOfLGROfConsoleMonitorOfConsoleLoggerOfTwoGenericsOfMonitorOfLoggerOfConsoleMonitorOfConsoleLoggerSingletonServiceResolver extends SingletonServiceResolver<ITwoGeneric<Monitor<L.Logger>, ConsoleMonitor<ConsoleLogger>>> {
    doResolve(serviceProvider: ServiceProvider): ITwoGeneric<Monitor<L.Logger>, ConsoleMonitor<ConsoleLogger>> {
        const ctor: InstanceConstructor<TwoGenericsImpl<Monitor<LGR>, ConsoleMonitor<ConsoleLogger>>> = TwoGenericsImpl<Monitor<LGR>, ConsoleMonitor<ConsoleLogger>>;

        return new ctor();
    }
}