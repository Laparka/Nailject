export interface ContainerBuilder {
  addTransient<TService, TImplementation extends TService>(serviceTypeId: symbol): void;
  addSingleton<TService, TImplementation extends TService>(serviceTypeId: symbol): void;
}


export type LifetimeScope = 'Transient' | 'Singleton';