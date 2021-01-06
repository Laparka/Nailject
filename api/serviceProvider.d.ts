import { ServiceResolver } from './serviceResolver';
export interface ServiceProvider {
    resolveMany<TService>(serviceId: symbol): TService[];
    resolveOne<TService>(serviceId: symbol): TService;
}
export interface ServiceScopeProvider {
    getSingletonServiceProvider(): ServiceProvider;
    getTransientServiceProvider(): ServiceProvider;
}
export declare class CompiledServiceProvider implements ServiceProvider, ServiceScopeProvider {
    private static _SingletonServiceProvider;
    private readonly _serviceResolversMap;
    private readonly _resolvedInstances;
    private constructor();
    static initialize(serviceResolvers: Map<symbol, ServiceResolver[]>): ServiceProvider;
    getSingletonServiceProvider(): ServiceProvider;
    getTransientServiceProvider(): ServiceProvider;
    resolveOne<TService>(serviceTypeId: symbol): TService;
    resolveMany<TService>(serviceTypeId: symbol): TService[];
}
