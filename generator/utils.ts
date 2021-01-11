import { ImportFrom, CodeAccessor } from './generatorContext';
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

/**
 * Looks the property accessor signature and finds a valid import declaration
 * @param pathAccessor: The property accessor
 * @param imports: The list of all imports declared in your file
 */
export function tryFindImportByAccessor(pathAccessor: CodeAccessor, imports: ImportFrom[]): ImportFrom | null {
  if (!pathAccessor) {
    throw Error(`The path accessor argument is missing`)
  }

  if (!imports) {
    throw Error(`The list of imports argument is missing`);
  }

  const importIndex = imports.findIndex(i => i.alias === pathAccessor.name);
  if (importIndex === -1) {
    return null;
  }

  return imports[importIndex];
}

export function getNormalizedImport(pathAccessor: CodeAccessor): ImportFrom | null {
  if (!pathAccessor) {
    throw Error(`The path accessor is missing`);
  }

  if (!pathAccessor.importFrom) {
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
  const clone: ImportFrom = JSON.parse(JSON.stringify(pathAccessor.importFrom));

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
