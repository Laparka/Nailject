import { LifetimeScope } from '../api/containerBuilder';

export type GeneratorMode = 'Module' | 'Dependent';

export type RegistrationSymbol = {
  symbolNamespace: string;
  symbolId: string;
};

export type CodeAccessor = {
  name: string;
  typeNames?: CodeAccessor[] | undefined;
  child?: CodeAccessor | undefined;
};

export type ImportKind = 'Named' | 'Default' | 'Namespace';
export type ImportFrom = {
  kind: ImportKind;
  name: string;
  alias: string;
  path: string;
};

export type ServiceDescriptor = {
  displayName: string;
  accessorDeclaration: string;
  symbolDescriptor: RegistrationSymbol;
  importFrom: ImportFrom;
  accessor: CodeAccessor;
};

export type ConstructorArgumentDescriptor = {
  isCollection: boolean;
  symbolPath: string;
};

export type InstanceDescriptor = {
  displayName: string;
  accessorDeclaration: string;
  importFrom: ImportFrom;
  accessor: CodeAccessor;
  constructorArgs: ConstructorArgumentDescriptor[];
};

export type RegistrationDescriptor = {
  scope: LifetimeScope;
  imports: ImportFrom[];
  service: ServiceDescriptor;
  instance: InstanceDescriptor;
};

export type GeneratorContext = {
  modulePath: string;
  mode: GeneratorMode;
  instanceName: string;
  imports: ImportFrom[],
  registrations: RegistrationDescriptor[]
};