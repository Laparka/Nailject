import { LifetimeScope } from '../pileuple-api/containerBuilder';
import { ScriptTarget } from 'typescript';

export type GeneratorParameters = {
  registrationFilePath: string;
  registrationClassName: string;
  outputDirectory: string;
  scriptTarget: ScriptTarget;
};

export type GeneratorMode = 'Module' | 'Dependent';

export type ImportKind = 'Named' | 'Default' | 'Namespace';

export type ImportFrom = {
  kind: ImportKind;
  name: string;
  alias: string;
  path: string;
  isExternal: boolean;
};

export type Import = {
  raw: ImportFrom;
  normalized: ImportFrom;
};

export type CodeAccessor = {
  name: string;
  importFrom?: Import;
  typeNames?: CodeAccessor[];
  child?: CodeAccessor;
};

export type ResolveType = 'One' | 'Many';
export type ConstructorDescriptor = {
  symbolDescriptor: CodeAccessor;
  resolveType: ResolveType;
};

export type ServiceDescriptor = {
  accessor: CodeAccessor;
  symbolDescriptor?: CodeAccessor;
};

export type InstanceDescriptor = {
  accessor: CodeAccessor;
  constructorArgs: ConstructorDescriptor[];
};

export type RegistrationDescriptor = {
  scope: LifetimeScope;
  service: ServiceDescriptor;
  instance?: InstanceDescriptor;
};

export type GeneratorContext = {
  modulePath: string;
  mode: GeneratorMode;
  instanceName: string;
  imports: ImportFrom[],
  registrations: RegistrationDescriptor[]
};