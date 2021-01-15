import { CodeAccessor, ImportFrom } from './generatorContext';
import path from 'path';

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

function getNormalizedImport(pathAccessor: CodeAccessor, rawImport: ImportFrom): ImportFrom | null {
  if (!pathAccessor) {
    throw Error(`The path accessor is missing`);
  }

  if (!rawImport) {
    return null;
  }

  /*
  * import Logger from './';
  * import {Logger as Shlogger} from './';
  * import * as S from './';
  * const a: S.Logger = {};
  * const b: Shlogger = {};
  * const c: Logger = {};
  */
  const clone: ImportFrom = JSON.parse(JSON.stringify(rawImport));

  switch (clone.kind) {
    case 'Namespace': {
      if (!pathAccessor.child) {
        throw Error(`The property accessor must have a child property when a namespace-import is used`);
      }

      clone.kind = 'Named';
      clone.name = pathAccessor.child.name;
      clone.alias = clone.name;
      break;
    }
    case 'Named': {
      clone.alias = clone.name;
      clone.kind = 'Named';
      break;
    }
  }

  return clone;
}

export function normalizeAccessor(pathAccessor: CodeAccessor, imports: ImportFrom[]) {
  if (!pathAccessor) {
    throw Error(`The path accessor argument is missing`)
  }

  if (!imports) {
    throw Error(`The list of imports argument is missing`);
  }

  const importIndex = imports.findIndex(i => i.alias === pathAccessor.name);
  if (importIndex === -1) {
    return;
  }

  const normalizedImport = getNormalizedImport(pathAccessor, imports[importIndex]);
  if (!normalizedImport) {
    throw Error(`Unexpected error. Failed to normalize the import declaration ${imports[importIndex].name} for the type reference ${pathAccessor.name}`)
  }

  pathAccessor.importFrom = {
    raw: imports[importIndex],
    normalized: normalizedImport
  };
}