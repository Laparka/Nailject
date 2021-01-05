import { ServiceProvider, ServiceScopeProvider } from './serviceProvider';

export type InstanceConstructor<T> = new (...args: any[]) => T;

export interface ServiceResolver {
  resolve(scopeProvider: ServiceScopeProvider): any;
}

export abstract class SingletonServiceResolver<TService> implements ServiceResolver {
  resolve(scopeProvider: ServiceScopeProvider): any {
    const serviceProvider = scopeProvider.getSingletonServiceProvider();
    return this.doResolve(serviceProvider);
  }

  protected abstract doResolve(serviceProvider: ServiceProvider): TService;
}

export abstract class TransientServiceResolver<TService> implements ServiceResolver {
  resolve(scopeProvider: ServiceScopeProvider): any {
    const serviceProvider = scopeProvider.getTransientServiceProvider();
    return this.doResolve(serviceProvider);
  }

  protected abstract doResolve(serviceProvider: ServiceProvider): TService;
}