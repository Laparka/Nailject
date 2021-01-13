import { CodeAccessor } from '../generator/generatorContext';

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