import { ImportFrom, CodeAccessor } from './generatorContext';
import path from 'path';

const ALPHA = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o', 'p', 'q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O', 'P', 'Q','R','S','T','U','V','W','X','Y','Z','_'];
const NUMERIC = ['1','2','3','4','5','6','7','8','9','0'];

export function getLastPropertyAccessor(node: CodeAccessor): string {
  if (node.child) {
    return getLastPropertyAccessor(node.child);
  }

  return node.name
}

export function addUsedImports(node: CodeAccessor, imports: ImportFrom[], usedImports: ImportFrom[], skipChild?: boolean): ImportFrom | null {
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

  if (!skipChild && !usedImport && node.child) {
    addUsedImports(node.child, imports, usedImports, true);
  }

  if (node.typeNames) {
    for (const typeName of node.typeNames) {
      addUsedImports(typeName, imports, usedImports);
    }
  }

  return usedImport;
}

export function tryFindImportType(importName: string, imports: ImportFrom[]): ImportFrom | null {
  if (imports) {
    const index = imports.findIndex(_ => _.alias === importName);
    if(index >= 0) {
      return imports[index];
    }
  }

  return null;
}

export function toNamespace(path: string): string {
  const result: string[] = [];
  for(const ch of path) {
    if (ALPHA.findIndex(_ => _ === ch) >= 0 || NUMERIC.findIndex(_ => _ === ch) >= 0) {
      result.push(ch);
    }
  }

  if (result.length === 0 || result[0] !== '_') {
    return '_' + result.join('');
  }

  return result.join('');
}

export function getSymbolName(node: CodeAccessor, imports: ImportFrom[]): string {
  const nameTokens: string[] = [];
  if (node.name !== '[]') {
    const imported = tryFindImportType(node.name, imports);
    let name = node.name;
    if (imported && node.name === imported.alias) {
      name = imported.name;
    }

    if (name !== '*') {
      nameTokens.push(name);
    }
  }

  if (node.child) {
    // Alias accessor
    nameTokens.push(getSymbolName(node.child, imports));
  }

  if (node.typeNames && node.typeNames.length !== 0) {
    node.typeNames.forEach(n => nameTokens.push(getSymbolName(n, imports)));
  }

  return nameTokens.join('Of');
}

export function getAccessorDeclaration(codeAccessor: CodeAccessor, imports: ImportFrom[]): string {
  let name = codeAccessor.name;
  if (name === '[]') {
    if (codeAccessor.child) {
      return `${getAccessorDeclaration(codeAccessor.child, imports)}[]`;
    }
  }

  const genericArgs: string[] = [];
  if (codeAccessor.child) {
    name = `${name}.${getAccessorDeclaration(codeAccessor.child, imports)}`;
  }
  else if (codeAccessor.typeNames && codeAccessor.typeNames.length !== 0) {
    codeAccessor.typeNames.forEach(n => genericArgs.push(getAccessorDeclaration(n, imports)));
  }

  if (genericArgs.length === 0) {
    return name;
  }

  return `${name}<${genericArgs.join(', ')}>`;
}

export function getFullPath(basePath: string, relativePath: string): string {
  return path.join(basePath, relativePath).replace(/[\\]/g, '/');
}

export function getRelativePath(outputDir: string, importFrom: ImportFrom): string {
  if (!importFrom.isExternal) {
    const relativePath = path.relative(outputDir, importFrom.path).replace(/[\\]/g, '/');
    return `./${relativePath}`;
  }

  return importFrom.path;
}