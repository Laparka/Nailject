import { ServiceResolver } from './serviceResolver';

export interface ServiceProvider {
  resolveMany<TService>(serviceId: symbol): TService[];
  resolveOne<TService>(serviceId: symbol): TService;
}

export interface ServiceScopeProvider {
  getSingletonServiceProvider(): ServiceProvider;
  getTransientServiceProvider(): ServiceProvider;
}

export const ServiceProviderSymbol = Symbol.for('PileupleServiceProvider');

class ServiceProviderSelfResolver implements ServiceResolver {
  constructor(private readonly _serviceProvider: ServiceProvider) {
  }
  resolve(scopeProvider: ServiceScopeProvider): any {
    return this._serviceProvider;
  }
}

export class CompiledServiceProvider implements ServiceProvider, ServiceScopeProvider {
  private static _SingletonServiceProvider: ServiceProvider;
  private readonly _serviceResolversMap: Map<symbol, ServiceResolver[]>;
  private readonly _resolvedInstances: Map<symbol, any[]>;

  private constructor(serviceResolvers: Map<symbol, ServiceResolver[]>) {
    this._serviceResolversMap = serviceResolvers;
    this._resolvedInstances = new Map<symbol, any[]>();
  }

  static initialize(serviceResolvers: Map<symbol, ServiceResolver[]>): ServiceProvider {
    if (!CompiledServiceProvider._SingletonServiceProvider) {
      const singletonProvider = new CompiledServiceProvider(serviceResolvers);
      serviceResolvers.set(ServiceProviderSymbol, [new ServiceProviderSelfResolver(singletonProvider)]);
      CompiledServiceProvider._SingletonServiceProvider = singletonProvider;
    }

    return CompiledServiceProvider._SingletonServiceProvider;
  }

  getSingletonServiceProvider(): ServiceProvider {
    return CompiledServiceProvider._SingletonServiceProvider;
  }

  getTransientServiceProvider(): ServiceProvider {
    return new CompiledServiceProvider(this._serviceResolversMap);
  }

  resolveOne<TService>(serviceTypeId: symbol): TService {
    const all = this.resolveMany<TService>(serviceTypeId);
    return all[all.length - 1];
  }

  resolveMany<TService>(serviceTypeId: symbol): TService[] {
    const instances: TService[] = [];
    const resolved: any[] | undefined = this._resolvedInstances.get(serviceTypeId);
    if (resolved) {
      instances.push(...resolved);
    } else {
      const serviceResolvers = this._serviceResolversMap.get(serviceTypeId);
      if (!serviceResolvers) {
        throw Error(`Failed to find service resolvers for the serviceID ${Symbol.keyFor(serviceTypeId)}`);
      }

      for (const resolver of serviceResolvers) {
        instances.push(resolver.resolve(this));
      }

      if (instances.length === 0) {
        throw Error('No registered interfaces were found');
      }

      this._resolvedInstances.set(serviceTypeId, instances);
    }

    return instances;
  }
}