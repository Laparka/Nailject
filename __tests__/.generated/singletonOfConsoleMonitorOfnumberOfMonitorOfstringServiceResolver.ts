
    
import Monitor from './__tests__/interfaces/monitor';
    

    
import ConsoleMonitor from './__tests__/services/consoleMonitor';
    


export default class ConsoleMonitorOfnumberOfMonitorOfstringSingletonServiceResolver extends SingletonServiceResolver<Monitor<string>> {
    doResolve(serviceProvider: ServiceProvider): Monitor<string> {
        const ctor: InstanceConstructor<ConsoleMonitor<number>> = ConsoleMonitor<number>;

        return new ctor();
    }
}