import { ImportType } from './generatorContext';

export function tryFindImportType(importName: string, imports: ImportType[]): ImportType | null {
  if (imports) {
    const index = imports.findIndex(_ => _.name === importName && !_.alias || _.alias === importName);
    if(index >= 0) {
      return imports[index];
    }
  }

  return null;
}