import { ContainerBuilder } from './containerBuilder';
export interface DependenciesRegistration {
    register(containerBuilder: ContainerBuilder): void;
}
