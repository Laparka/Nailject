import { LifetimeScope } from '../pileuple-api/containerBuilder';
import { ScriptTarget } from 'typescript';
export declare type GeneratorParameters = {
    registrationFilePath: string;
    registrationClassName: string;
    outputDirectory: string;
    scriptTarget: ScriptTarget;
};
export declare type GeneratorMode = 'Module' | 'Dependent';
export declare type ImportKind = 'Named' | 'Default' | 'Namespace';
export declare type ImportFrom = {
    kind: ImportKind;
    name: string;
    alias: string;
    path: string;
    isExternal: boolean;
};
export declare type Import = {
    raw: ImportFrom;
    normalized: ImportFrom;
};
export declare type CodeAccessor = {
    name: string;
    importFrom?: Import;
    typeNames?: CodeAccessor[];
    child?: CodeAccessor;
};
export declare type ResolveType = 'One' | 'Many';
export declare type ConstructorDescriptor = {
    symbolDescriptor: CodeAccessor;
    resolveType: ResolveType;
};
export declare type ServiceDescriptor = {
    accessor: CodeAccessor;
    symbolDescriptor?: CodeAccessor;
};
export declare type InstanceDescriptor = {
    accessor: CodeAccessor;
    constructorArgs: ConstructorDescriptor[];
};
export declare type RegistrationDescriptor = {
    scope: LifetimeScope;
    service: ServiceDescriptor;
    instance?: InstanceDescriptor;
};
export declare type GeneratorContext = {
    modulePath: string;
    mode: GeneratorMode;
    instanceName: string;
    imports: ImportFrom[];
    registrations: RegistrationDescriptor[];
};
