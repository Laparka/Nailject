import { LifetimeScope } from './lifetimeScope';

export type ImportKind = "Default" | "Named" | "Namespace";
export type ImportType = {
  name: string;
  alias: string;
  kind: ImportKind
};

export type GeneratorMode = 'Aggregating' | 'Generating';

export type DependencyDescriptor = {
  dependencies: string[],
  serviceType: string[],
  instanceType: string[],
  imports: Map<string, ImportType[]>
};

export type GeneratorContext = {
  modulePath: string;
  mode: GeneratorMode;
  import: Map<string, ImportType[]>,
  instanceName: string;
  usedImports: Map<string, ImportType[]>,
  registrations: Map<LifetimeScope, DependencyDescriptor[]> | undefined
};