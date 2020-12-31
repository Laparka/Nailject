import { ImportType, NodeResult } from './generatorContext';

export function getLastPropertyAccessor(node: NodeResult): string {
  if (node.child) {
    return getLastPropertyAccessor(node.child);
  }

  return node.name
}

export function addUsedImports(node: NodeResult, imports: ImportType[], usedImports: ImportType[]): ImportType | null {
  if (node.name === '[]') {
    if (!node.child) {
      throw Error('The array type must have the element type object');
    }

    return addUsedImports(node.child, imports, usedImports);
  }

  let usedImport = tryFindImportType(node.name, usedImports);
  if (!usedImport) {
    usedImport = tryFindImportType(node.name, imports);
    if (!usedImport) {
      return null;
    }

    usedImports.push(usedImport);
  }

  if (node.child) {
    addUsedImports(node.child, imports, usedImports);
  }

  for(let i = 0; i < node.typeNames.length; i++) {
    addUsedImports(node.typeNames[i], imports, usedImports);
  }

  return usedImport;
}

export function tryFindImportType(importName: string, imports: ImportType[]): ImportType | null {
  const importId = importName.split(/[.]/g)[0];
  if (imports) {
    const index = imports.findIndex(_ => _.alias === importId);
    if(index >= 0) {
      return imports[index];
    }
  }

  return null;
}