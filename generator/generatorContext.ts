import { LifetimeScope } from '../api/containerBuilder';

export type GeneratorMode = 'Module' | 'Dependent';

export type ServiceResolverDeclaration = {
  context: GeneratorContext;
  dependencies: string[];
  serviceType: string[];
  instanceType: string[];
};

export type ImportType = {
  path: string;
  name: string;
  alias: string;
  fromPackage: boolean;
};

export type GeneratorContext = {
  modulePath: string;
  mode: GeneratorMode;
  instanceName: string;
  imports: ImportType[],
  resolvers: Map<LifetimeScope, ServiceResolverDeclaration[]>
};