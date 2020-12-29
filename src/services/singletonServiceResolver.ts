import { ServiceResolver } from '../interfaces/serviceResolver';
import ServiceScopeProvider from '../interfaces/serviceScopeProvider';
import ServiceProvider from '../interfaces/serviceProvider';

export default abstract class SingletonServiceResolver<TInstance> implements ServiceResolver {
  resolve(scopeProvider: ServiceScopeProvider): any {
    const serviceProvider = scopeProvider.getSingletonServiceProvider();
    return this.doResolve(serviceProvider);
  }

  protected abstract doResolve(serviceProvider: ServiceProvider): TInstance;
}