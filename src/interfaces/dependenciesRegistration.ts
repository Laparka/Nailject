import IContainerBuilder from './containerBuilder';

export default interface DependenciesRegistration {
  register(containerBuilder: IContainerBuilder): void;
}
