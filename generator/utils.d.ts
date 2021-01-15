import { CodeAccessor, ImportFrom } from './generatorContext';
export declare function getFullPath(basePath: string, relativePath: string): string;
export declare function getRelativePath(outputDir: string, importFrom: ImportFrom): string;
export declare function normalizeAccessor(pathAccessor: CodeAccessor, imports: ImportFrom[]): void;
