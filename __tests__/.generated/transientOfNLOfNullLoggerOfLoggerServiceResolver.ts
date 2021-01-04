
    
        
import { Logger as LGR } from '__tests__/interfaces/logger';
        
    

    
import * as NL from '__tests__/services/nullLogger';
import { InstanceConstructor, TransientServiceResolver } from '../../api/serviceResolver';
import { ServiceProvider } from '../../api/serviceProvider';
    


export default class NLOfNullLoggerOfLoggerTransientServiceResolver extends TransientServiceResolver<LGR> {
    doResolve(serviceProvider: ServiceProvider): LGR {
        const ctor: InstanceConstructor<NL.NullLogger> = NL.NullLogger;

        return new ctor();
    }
}