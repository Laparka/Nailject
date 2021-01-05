#  Ulutshaizing and Documentation In Progress 
# TypeScript Dependency Injection
This is my learning project.
Detects container builder registrations and generated service resolvers with a IoC container.
The IoC Container then used to resolve services by symbols.

## Register your dependencies

### Project Structure Example
```
src/
├── services/
│   ├── logger.ts
│   └── apiService.ts
└── registrations.ts
```

### src/registration.ts file content
```typescript
import { Logger, ConsoleLoggerImpl } from "./services/logger";
import { ApiService, DebugApiServiceImpl } from "./services/apiService";
import { ContainerBuilder } from 'iocgenerator/api/containerBuilder';
import { DependenciesRegistration } from 'iocgenerator/api/dependenciesRegistration';

export class Registrations implements DependenciesRegistration {
    register(containerBuilder: ContainerBuilder): void {
        containerBuilder.addTransient<Logger, ConsoleLoggerImpl>();
        containerBuilder.addSingleton<ApiService, DebugApiServiceImpl>();
    }
}
```

### src/services/logger.ts file content

```typescript
export interface Logger {
  logError(message: string): void;
  logInfo(message: string): void;
  logWarning(message: string): void;
}

export class ConsoleLoggerImpl implements Logger {
  logError(message: string) {
    console.error(message);
  }

  logInfo(message: string) {
    console.info(message);
  }

  logWarning(message: string) {
    console.warn(message);
  }
}
```

### src/services/apiService.ts file content

```typescript
import { Logger } from './logger';

export interface ApiService {
  get(url: string, headers: Map<string, string>): string;

  post(url: string, payload: any, headers: Map<string, string>): string;

  delete(url: string, headers: Map<string, string>): string;
}

export class DebugApiServiceImpl implements ApiService {
  private _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  delete(url: string, headers: Map<string, string>): string {
    this._logger.logInfo(`DELETE HTTP Request was sent to ${url}`);
    return '{}';
  }

  get(url: string, headers: Map<string, string>): string {
    this._logger.logInfo(`GET HTTP Request was sent to ${url}`);
    return '{}';
  }

  post(url: string, payload: any, headers: Map<string, string>): string {
    this._logger.logInfo(`POST HTTP Request was sent to ${url} with ${JSON.stringify(payload)}`);
    return '{}';
  }
}
```

#### Run the following command
>
>`npm run iocgenerator -- ./registrations.ts --moduleName Registrations --outputDir ./services/__generated/`

Please note, that there is -- after the iocgenerator statement. This is my first TypeScript NodeJS project

### Check the generated files with your outputDir
```
src/
├── services/
│   ├── __generated/
│   │    ├── consoleLoggerImplOfLoggerTransientServiceResolver.ts
│   │    ├── debugApiServiceImplOfApiServiceSingletonServiceResolver.ts
│   │    ├── index.ts
│   │    └── types.generated.ts
│   │
│   ├── logger.ts
│   └── apiService.ts
└── registrations.ts
```

### Example of generated content of the ApiServiceResolver
```typescript
import { ApiService as ApiService } from '../apiService';
import { DebugApiServiceImpl as DebugApiServiceImpl } from '../apiService';

import { TYPES as __SERVICE_TYPE_SYMBOLS } from './types.generated';
import { SingletonServiceResolver, InstanceConstructor, ServiceResolver } from 'iocgenerator/api/serviceResolver';
import { ServiceProvider } from 'iocgenerator/api/serviceProvider';

class Resolver extends SingletonServiceResolver<ApiService> {
    doResolve(serviceProvider: ServiceProvider): ApiService {
        const ctor: InstanceConstructor<DebugApiServiceImpl> = DebugApiServiceImpl;
        const ctorArgs: any[] = [];
        ctorArgs.push(serviceProvider.resolveOne(__SERVICE_TYPE_SYMBOLS._srcserviceslogger.Logger));
        return new ctor(...ctorArgs);
    }
}

export function register(resolvers: Map<symbol, ServiceResolver[]>) {
    const symbol = __SERVICE_TYPE_SYMBOLS._srcservicesapiService.ApiService;
    let symbolResolvers = resolvers.get(symbol);
    if (!symbolResolvers) {
        symbolResolvers = [];
        resolvers.set(symbol, symbolResolvers);
    }

    symbolResolvers.push(new Resolver());
}
```

The main file, which contains the IoC Service Provider is in the index.ts:
```typescript
import { register as register1 } from './consoleLoggerImplOfLoggerTransientServiceResolver';
import { register as register2 } from './debugApiServiceImplOfApiServiceSingletonServiceResolver';

import { ServiceProvider, CompiledServiceProvider } from 'iocgenerator/api/serviceProvider';
import { ServiceResolver } from 'iocgenerator/api/serviceResolver';

const symbolResolvers = new Map<symbol, ServiceResolver[]>();

register1(symbolResolvers);
register2(symbolResolvers);
export const serviceProvider: ServiceProvider = CompiledServiceProvider.initialize(symbolResolvers);
```

### Usage
```typescript
import {serviceProvider} from "./src/services/__generated";
import {ApiService} from "./src/services/apiService";
import {TYPES} from "./src/services/__generated/types.generated";

const apiService = serviceProvider.resolveOne<ApiService>(TYPES._srcservicesapiService.ApiService);
export function call() {
console.log(apiService.get('/api/v1/test', new Map<string, string>()));
}
```