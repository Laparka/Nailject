export interface ContainerBuilder {
    addTransient<TService, TImplementation extends TService>(): void;
    addSingleton<TService, TImplementation extends TService>(): void;
}
export declare type LifetimeScope = 'Transient' | 'Singleton';
