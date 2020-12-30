import { ImportType } from './generatorContext';

export function tryFindImportType(importName: string, imports: ImportType[]): ImportType | null {
  const importId = importName.split(/[.]/g)[0];
  if (imports) {
    const index = imports.findIndex(_ => _.name === importId && !_.alias || _.alias === importId);
    if(index >= 0) {
      return imports[index];
    }
  }

  return null;
}