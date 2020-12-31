import { LifetimeScope } from '../api/containerBuilder';
import RegistrationsParser from './registrationsParser';

export type GeneratorMode = 'Module' | 'Dependent';

export type InstanceTypeDeclaration = {
  type: NodeResult;
  path: ImportType;
};

export type ServiceResolverDeclaration = {
  imports: ImportType[],
  serviceTypeNode: NodeResult;
  instanceTypeNode: InstanceTypeDeclaration;
  typeSymbolNode: NodeResult;
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
  generator: RegistrationsParser
};