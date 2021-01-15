import { CodeAccessor, ImportFrom, RegistrationDescriptor } from '../generator/generatorContext';
export declare function readAccessor(pathAccessor: CodeAccessor, includeGenericArgs: boolean): string;
export declare function getImports(registration: RegistrationDescriptor): ImportFrom[];
export declare function writeImport(importFrom: ImportFrom, outputDir: string): string;
