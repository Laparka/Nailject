import ServiceProvider from '../interfaces/serviceProvider';
import { ServiceResolver } from '../interfaces/serviceResolver';
import ServiceScopeProvider from '../interfaces/serviceScopeProvider';
import ServiceResolversRegistry from '../interfaces/serviceResolversRegistry';

export default class CompiledServiceProvider implements ServiceProvider, ServiceScopeProvider, ServiceResolversRegistry {
  private static readonly _SingletonServiceProvider: ServiceProvider = new CompiledServiceProvider();
  private static readonly _ServiceResolversMap: Map<symbol, ServiceResolver[]> = new Map<symbol, ServiceResolver[]>();

  getSingletonServiceProvider(): ServiceProvider {
    return CompiledServiceProvider._SingletonServiceProvider;
  }

  getTransientServiceProvider(): ServiceProvider {
    return new CompiledServiceProvider();
  }

  resolveOne<TService>(serviceTypeId: symbol): TService {
    const all = this.resolveMany<TService>(serviceTypeId);
    return all[all.length - 1];
  }

  resolveMany<TService>(serviceTypeId: symbol): TService[] {
    const serviceResolvers = CompiledServiceProvider._ServiceResolversMap.get(serviceTypeId);
    if (!serviceResolvers) {
      throw Error(`Failed to find service resolvers for the serviceID ${Symbol.keyFor(serviceTypeId)}`);
    }

    const instances: TService[] = [];
    for(let i = 0; i < serviceResolvers.length; i++) {
      instances.push(serviceResolvers[i].resolve(this));
    }

    if (instances.length === 0) {
      throw Error('No registered interfaces were found');
    }

    return instances;
  }

  registerResolver(serviceTypeId: symbol, serviceResolver: ServiceResolver): void {
    if (!serviceTypeId) {
      throw Error('Service Type ID is required')
    }

    if (!serviceResolver) {
      throw Error('Service Resolver instance is required')
    }

    let resolvers = CompiledServiceProvider._ServiceResolversMap.get(serviceTypeId);
    if (!resolvers) {
      resolvers = [];
      CompiledServiceProvider._ServiceResolversMap.set(serviceTypeId, resolvers);
    }

    resolvers.push(serviceResolver);
  }
}