import { FilterImpl } from 'liquidjs/dist/template/filter/filter-impl';
import { ImportFrom, RegistrationSymbol } from '../../generator/generatorContext';
import * as path from 'path';

export function getFullPath(modulePath: string, relativePath: string): string {
  return path.join(modulePath, relativePath);
}

export function getRelativePath(outputDir: string, importFrom: ImportFrom): string {
  const fullPath = getFullPath(importFrom.relativePath, importFrom.path);
  const relativePath = path.relative(outputDir, fullPath).replace(/[\\]/g, '/');
  return relativePath;
}

export function toImportFilter(this: FilterImpl, importFrom: ImportFrom, outputDir: string): string {
  const importPath = getRelativePath(outputDir, importFrom);
  switch (importFrom.kind) {
    case 'Default': {
      return `import ${importFrom.name} from '${importPath}';`
    }
    case 'Named': {
      return `import { ${importFrom.name} as ${importFrom.alias} } from '${importPath}';`
    }
    case 'Namespace': {
      return `import * as ${importFrom.alias} from '${importPath}';`
    }
  }

  throw Error(`The import-kind is not supported`);
}

export function toSymbolPath(this: FilterImpl, symbolDescriptor: RegistrationSymbol): string {
  const symbolPath: string[] = [];
  if (symbolDescriptor.symbolNamespace) {
    symbolPath.push(symbolDescriptor.symbolNamespace);
  }

  symbolPath.push(symbolDescriptor.symbolId);
  return symbolPath.join('.');
}