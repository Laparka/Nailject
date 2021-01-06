import { FilterImpl } from 'liquidjs/dist/template/filter/filter-impl';
import { ImportFrom, RegistrationSymbol } from '../../generator/generatorContext';
export declare function getFullPath(modulePath: string, relativePath: string): string;
export declare function getRelativePath(outputDir: string, importFrom: ImportFrom): string;
export declare function toImportFilter(this: FilterImpl, importFrom: ImportFrom, outputDir: string): string;
export declare function toSymbolPath(this: FilterImpl, symbolDescriptor: RegistrationSymbol): string;