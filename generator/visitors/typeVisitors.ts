import { NodeVisitor, NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node, NodeArray, SyntaxKind, TypeNode, TypeReferenceNode } from 'typescript';
import { GeneratorContext, CodeAccessor, ImportFrom } from '../generatorContext';

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

function normalizeAccessor(pathAccessor: CodeAccessor, imports: ImportFrom[]) {
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

function getGenericTypeArgs(typeArgs: NodeArray<TypeNode>, nodeVisitor: NodeVisitor, context: GeneratorContext): CodeAccessor[] {
  const genericArgs: CodeAccessor[] = [];
  if (typeArgs) {
    for (const typeArg of typeArgs) {
      const genericTypeAccessor = nodeVisitor.visit(typeArg, context) as CodeAccessor;
      if (!genericTypeAccessor || !genericTypeAccessor.name) {
        throw Error(`Failed to parse the type's generic arguments`);
      }

      normalizeAccessor(genericTypeAccessor, context.imports);
      genericArgs.push(genericTypeAccessor);
    }
  }

  return genericArgs;
}

function toTypeReferenceAccessor(typeRefAccessor: CodeAccessor, imports: ImportFrom[]): CodeAccessor {
  if (!typeRefAccessor || !typeRefAccessor.name) {
    throw Error(`Failed to parse the type reference name`);
  }

  normalizeAccessor(typeRefAccessor, imports);
  return typeRefAccessor;
}

export class TypeReferenceVisitor extends NodeVisitorBase<TypeReferenceNode> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.TypeReference;
  }

  doVisit(node: TypeReferenceNode, context: GeneratorContext): CodeAccessor {
    const typeAccessor = toTypeReferenceAccessor(this.visitNext(node.typeName, context) as CodeAccessor, context.imports);
    if (node.typeArguments) {
      typeAccessor.typeNames = getGenericTypeArgs(node.typeArguments, this.rootVisitor, context);
    }

    return typeAccessor;
  }
}

export class TypeArgumentVisitor extends NodeVisitorBase<ExpressionWithTypeArguments> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ExpressionWithTypeArguments;
  }

  doVisit(node: ExpressionWithTypeArguments, context: GeneratorContext): CodeAccessor | void {
    const typeAccessor = toTypeReferenceAccessor(this.visitNext(node.expression, context) as CodeAccessor, context.imports);
    if (node.typeArguments) {
      typeAccessor.typeNames = getGenericTypeArgs(node.typeArguments, this.rootVisitor, context);
    }

    return typeAccessor;
  }
}