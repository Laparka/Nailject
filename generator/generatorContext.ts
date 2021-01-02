import { LifetimeScope } from '../api/containerBuilder';
import RegistrationsParser from './registrationsParser';

export type GeneratorMode = 'Module' | 'Dependent';

export type TypeDeclaration = {
  type: NodeResult;
  path: ImportType;
};

export type RegistrationSymbol = {
  symbolNamespace: string;
  symbolId: string;
};

export type ServiceResolverDeclaration = {
  scope: LifetimeScope;
  imports: ImportType[];
  serviceTypeNode: TypeDeclaration;
  instanceTypeNode: TypeDeclaration;
  registrationSymbol:RegistrationSymbol;
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
  resolvers: ServiceResolverDeclaration[],
  generator: RegistrationsParser
};