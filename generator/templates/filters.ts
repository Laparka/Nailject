import { FilterImpl } from 'liquidjs/dist/template/filter/filter-impl';
import { ImportFrom, SymbolDescriptor } from '../../generator/generatorContext';
import { getRelativePath } from '../utils';

export function toImportFilter(this: FilterImpl, importFrom: ImportFrom, outputDir: string): string {
  const importPath = getRelativePath(outputDir, importFrom);
  switch (importFrom.kind) {
    case 'Default': {
      return `import ${importFrom.name} from '${importPath}';`
    }
    case 'Named': {
      if (importFrom.alias === importFrom.name) {
        return `import { ${importFrom.name} } from '${importPath}';`
      }

      return `import { ${importFrom.name} as ${importFrom.alias} } from '${importPath}';`
    }
    case 'Namespace': {
      return `import * as ${importFrom.alias} from '${importPath}';`
    }
  }

  throw Error(`The import-kind is not supported`);
}

export function toSymbolPath(this: FilterImpl, symbolDescriptor: SymbolDescriptor): string {
  throw Error(`Not Implemented`);
}