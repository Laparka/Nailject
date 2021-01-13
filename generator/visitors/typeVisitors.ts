import { NodeVisitor, NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node, NodeArray, SyntaxKind, TypeNode, TypeReferenceNode } from 'typescript';
import { GeneratorContext, CodeAccessor, ImportFrom } from '../generatorContext';
import { normalizeAccessor } from '../utils';

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