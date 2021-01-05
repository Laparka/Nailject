import { ImportFrom, CodeAccessor } from './generatorContext';
export declare function getLastPropertyAccessor(node: CodeAccessor): string;
export declare function addUsedImports(node: CodeAccessor, imports: ImportFrom[], usedImports: ImportFrom[]): ImportFrom | null;
export declare function tryFindImportType(importName: string, imports: ImportFrom[]): ImportFrom | null;
export declare function toNamespace(path: string): string;
export declare function getSymbolName(node: CodeAccessor, imports: ImportFrom[]): string;
export declare function getAccessorDeclaration(codeAccessor: CodeAccessor, imports: ImportFrom[]): string;
