
    
import Monitor from './__tests__/interfaces/monitor';
    

    
import ConsoleMonitor from './__tests__/services/consoleMonitor';
    


export default class ConsoleMonitorOfanyOfMonitorOfanySingletonServiceResolver extends SingletonServiceResolver<Monitor<any>> {
    doResolve(serviceProvider: ServiceProvider): Monitor<any> {
        const ctor: InstanceConstructor<ConsoleMonitor<any>> = ConsoleMonitor<any>;

        return new ctor();
    }
}