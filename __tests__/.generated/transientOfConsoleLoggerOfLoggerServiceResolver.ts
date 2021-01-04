
    
import * as L from './__tests__/interfaces/logger';
    

    
import ConsoleLogger from './__tests__/services/consoleLogger';
    

    
import * as __service_type_symbols from '__tests__/.generated/types.generated';
    


export default class ConsoleLoggerOfLoggerTransientServiceResolver extends TransientServiceResolver<L.Logger> {
    doResolve(serviceProvider: ServiceProvider): L.Logger {
        const ctor: InstanceConstructor<ConsoleLogger> = ConsoleLogger;

    
        const service1 = serviceProvider.resolveOne();
    

        return new ctor(service0service1);
    }
}