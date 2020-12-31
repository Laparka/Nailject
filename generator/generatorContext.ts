import { LifetimeScope } from '../api/containerBuilder';
import ServiceResolversGenerator from './serviceResolversGenerator';

export type GeneratorMode = 'Module' | 'Dependent';

export type ConstructorInjectionsDeclaration = {

};

export type InstanceTypeDependencies = {
  constructorArgs: NodeResult[],
  imports: ImportType[]
};

export type InstanceTypeDeclaration = {
  type: NodeResult;
  path: ImportType;
};
export type ServiceResolverDeclaration = {
  imports: ImportType[],
  serviceTypeNode: NodeResult;
  instanceTypeNode: InstanceTypeDeclaration;
};

export type NodeResult = {
  name: string;
  typeNames: NodeResult[];
  child: NodeResult | null;
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
  resolvers: Map<LifetimeScope, ServiceResolverDeclaration[]>,
  generator: ServiceResolversGenerator
};