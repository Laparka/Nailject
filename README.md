# TypeScript Dependency Injection


## Generate Service Resolvers

### Example
```
src/
├── services/
│   ├── logger.ts
│   └── apiService.ts
└── registrations.ts
```

### services/logger.ts file content

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

### services/apiService.ts file content

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

### registration.ts file content
```typescript
import { Logger, ConsoleLoggerImpl } from "./logger";
import { ApiService, DebugApiServiceImpl } from "./apiService";
import { ContainerBuilder } from 'iocgenerator/api/containerBuilder';
import { DependenciesRegistration } from 'iocgenerator/api/dependenciesRegistration';

export class Registrations implements DependenciesRegistration {
    register(containerBuilder: ContainerBuilder): void {
        containerBuilder.addTransient<Logger, ConsoleLoggerImpl>();
        containerBuilder.addSingleton<ApiService, DebugApiServiceImpl>();
    }
}
```

>
>`npm run iocgenerator -- ./registrations.ts --moduleName Registrations --outputDir ./services/__generated/`

