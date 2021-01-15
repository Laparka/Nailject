import { ServiceProvider, ServiceScopeProvider } from './serviceProvider';
export declare type InstanceConstructor<T> = new (...args: any[]) => T;
export interface ServiceResolver {
    resolve(scopeProvider: ServiceScopeProvider): any;
}
export declare abstract class SingletonServiceResolver<TService> implements ServiceResolver {
    resolve(scopeProvider: ServiceScopeProvider): any;
    protected abstract doResolve(serviceProvider: ServiceProvider): TService;
}
export declare abstract class TransientServiceResolver<TService> implements ServiceResolver {
    resolve(scopeProvider: ServiceScopeProvider): any;
    protected abstract doResolve(serviceProvider: ServiceProvider): TService;
}
