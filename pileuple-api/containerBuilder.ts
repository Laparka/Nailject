import { DependenciesRegistration } from './dependenciesRegistration';

export interface ContainerBuilder {
  /**
   * Register a transient service implementation
   * @param serviceType A custom service type. A custom one will be generated, if not provided
   */
  addTransient<TService, TImplementation extends TService>(serviceType: symbol): void;

  /**
   * Register a singleton service implementation
   * @param serviceType A custom service type. A custom one will be generated, if not provided
   */
  addSingleton<TService, TImplementation extends TService>(serviceType: symbol): void;

  /**
   * Includes another registration builder
   * @param registration The dependency registration which will be included
   */
  include(registration: DependenciesRegistration): void;
}


export type LifetimeScope = 'Transient' | 'Singleton';