import { ServiceResolver } from '../interfaces/serviceResolver';
import ServiceScopeProvider from '../interfaces/serviceScopeProvider';
import ServiceProvider from '../interfaces/serviceProvider';

export default abstract class TransientServiceResolver<TInstance> implements ServiceResolver {
  resolve(scopeProvider: ServiceScopeProvider): any {
    const serviceProvider = scopeProvider.getTransientServiceProvider();
    return this.doResolve(serviceProvider);
  }

  protected abstract doResolve(serviceProvider: ServiceProvider): TInstance;
}