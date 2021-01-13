import { CodeAccessor, ImportFrom, RegistrationDescriptor } from '../generator/generatorContext';
import path from 'path';

export function readAccessor(pathAccessor: CodeAccessor, includeGenericArgs: boolean): string {
  const tokens: string[] = [];
  if (pathAccessor.name === '[]') {
    if (pathAccessor.child) {
      return readAccessor(pathAccessor.child, includeGenericArgs);
    }

    return '[]';
  }

  if (pathAccessor.importFrom) {
    tokens.push(pathAccessor.importFrom.normalized.name);
    if (pathAccessor.importFrom.raw.kind === 'Namespace' && pathAccessor.child) {
      pathAccessor = pathAccessor.child;
    }
  } else {
    tokens.push(pathAccessor.name);
  }

  const typeArgs: string[] = [];
  if (pathAccessor.child) {
    tokens.push(readAccessor(pathAccessor.child, includeGenericArgs));
  } else if (includeGenericArgs && pathAccessor.typeNames && pathAccessor.typeNames.length !== 0) {
    pathAccessor.typeNames.forEach(t => typeArgs.push(readAccessor(t, includeGenericArgs)));
  }

  if (typeArgs.length !== 0) {
    tokens[tokens.length - 1] = `${tokens[tokens.length - 1]}<${typeArgs.join(', ')}>`
  }

  return tokens.join('.');
}

export function getImports(registration: RegistrationDescriptor): ImportFrom[] {
  const importsByPath = new Map<string, ImportFrom[]>();
  collectImports(registration.service.accessor, importsByPath);
  if (registration.service.symbolDescriptor) {
    collectImports(registration.service.symbolDescriptor, importsByPath);
  }

  if (registration.instance) {
    collectImports(registration.instance.accessor, importsByPath);
  }

  const imports: ImportFrom[] = [];
  const iterator = importsByPath.keys();
  let keyAccessor = iterator.next();
  while(keyAccessor && !keyAccessor.done) {
    const pathImports = importsByPath.get(keyAccessor.value);
    if (!pathImports) {
      continue;
    }

    imports.push(...pathImports);
    keyAccessor = iterator.next();
  }

  return imports;
}

export function writeImport(importFrom: ImportFrom, outputDir: string): string {
  if (!importFrom) {
    throw Error(`Import argument is missing`);
  }

  if (!outputDir) {
    throw Error(`Output dir argument is missing`);
  }

  let importPath = importFrom.path;
  if (!importFrom.isExternal) {
    importPath  = path.relative(outputDir, importPath).replace(/[\\]/g, '/');
  }

  switch (importFrom.kind) {
    case 'Default': {
      return `import ${importFrom.name} from '${importPath}';`;
    }
  }

  if (importFrom.name === importFrom.alias) {
    return `import { ${importFrom.name} } from '${importPath}';`
  }

  return `import { ${importFrom.name} as ${ importFrom.alias } } from '${importPath}';`
}

function collectImports(accessor: CodeAccessor, importsByPath: Map<string, ImportFrom[]>) {
  if (accessor.importFrom) {
    setImport(accessor.importFrom.normalized, importsByPath);
  }

  if (accessor.child) {
    collectImports(accessor.child, importsByPath);
  }

  if (accessor.typeNames && accessor.typeNames.length !== 0) {
    accessor.typeNames.forEach(t => collectImports(t, importsByPath));
  }
}

function setImport(importFrom: ImportFrom, importsByPath: Map<string, ImportFrom[]>) {
  let pathImports = importsByPath.get(importFrom.path);
  if (!pathImports) {
    pathImports = [];
    importsByPath.set(importFrom.path, pathImports);
  }

  if (pathImports.findIndex(i => i.name === importFrom.name) === -1) {
    pathImports.push(importFrom);
  }
}