export interface ContainerBuilder {
  addTransient<TService, TImplementation extends TService>(): void;
  addSingleton<TService, TImplementation extends TService>(): void;
}


export type LifetimeScope = 'Transient' | 'Singleton';