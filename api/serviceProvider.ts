import { ServiceResolver } from './serviceResolver';

export interface ServiceProvider {
  resolveMany<TService>(serviceId: symbol): TService[];
  resolveOne<TService>(serviceId: symbol): TService;
}

export interface ServiceScopeProvider {
  getSingletonServiceProvider(): ServiceProvider;
  getTransientServiceProvider(): ServiceProvider;
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
      CompiledServiceProvider._SingletonServiceProvider = new CompiledServiceProvider(serviceResolvers);
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