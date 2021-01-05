import { LifetimeScope } from '../api/containerBuilder';
export declare type GeneratorMode = 'Module' | 'Dependent';
export declare type RegistrationSymbol = {
    symbolNamespace: string;
    symbolId: string;
};
export declare type CodeAccessor = {
    name: string;
    typeNames?: CodeAccessor[] | undefined;
    child?: CodeAccessor | undefined;
};
export declare type ImportKind = 'Named' | 'Default' | 'Namespace';
export declare type ImportFrom = {
    kind: ImportKind;
    name: string;
    alias: string;
    path: string;
    isExternal: boolean;
    relativePath: string;
};
export declare type ServiceDescriptor = {
    displayName: string;
    accessorDeclaration: string;
    symbolDescriptor: RegistrationSymbol;
    importFrom: ImportFrom | null;
    accessor: CodeAccessor;
};
export declare type ConstructorArgumentDescriptor = {
    isCollection: boolean;
    symbolDescriptor: RegistrationSymbol;
};
export declare type InstanceDescriptor = {
    displayName: string;
    accessorDeclaration: string;
    importFrom: ImportFrom | null;
    accessor: CodeAccessor;
    instanceTypeDefinition: string;
    constructorArgs: ConstructorArgumentDescriptor[];
};
export declare type RegistrationDescriptor = {
    scope: LifetimeScope;
    imports: ImportFrom[] | null;
    service: ServiceDescriptor;
    instance: InstanceDescriptor | null;
};
export declare type GeneratorContext = {
    modulePath: string;
    mode: GeneratorMode;
    instanceName: string;
    imports: ImportFrom[];
    registrations: RegistrationDescriptor[];
};
