import { ImportType, NodeResult } from './generatorContext';

const ALPHA = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','Q','R','S','T','U','V','W','X','Y','Z','_'];
const NUMERIC = ['1','2','3','4','5','6','7','8','9','0'];

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

export function toNamespace(path: string): string {
  const result: string[] = [];
  for(let i = 0; i < path.length; i++) {
    if (ALPHA.findIndex(_ => _ === path[i]) >= 0 || NUMERIC.findIndex(_ => _ === path[i]) >= 0) {
      result.push(path[i]);
    }
  }

  if (result.length !== 0 && NUMERIC.findIndex(_ => _ === result[0])) {
    result[0] = '_';
  }

  return result.join('');
}

export function getSymbolName(node: NodeResult, imports: ImportType[]): string {
  const nameTokens: string[] = [];
  if (node.name === '[]') {
    nameTokens.push('Array');
  }
  else if (node.child) {
    // Alias accessor
    nameTokens.push(getSymbolName(node.child, imports));
  }
  else {
    const imported = tryFindImportType(node.name, imports);
    let name = node.name;
    if (imported && node.name === imported.alias) {
      name = imported.name;
    }

    nameTokens.push(name);
  }

  if (node.typeNames.length !== 0) {
    node.typeNames.forEach(n => nameTokens.push(getSymbolName(n, imports)));
  }

  return nameTokens.join('Of');
}