import { ContainerBuilder } from './containerBuilder';
export interface DependenciesRegistration {
    /**
     * Registers dependencies
     */
    register(containerBuilder: ContainerBuilder): void;
}
