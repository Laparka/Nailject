import { NodeVisitorBase } from './nodeVisitor';
import { Node, SyntaxKind, TypeReferenceNode } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class TypeReferenceVisitor extends NodeVisitorBase<TypeReferenceNode> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.TypeReference;
  }

  doVisit(node: TypeReferenceNode, context: GeneratorContext): Map<string, string[]> {
    const genericArgs: string[] = [];
    if (node.typeArguments) {
      for (let i = 0; i < node.typeArguments.length; i++) {
        const genericTypeTokens = this.visitNext(node.typeArguments[i], context);
        if (!genericTypeTokens || genericTypeTokens.size !== 1) {
          throw Error(`Failed to parse the type's generic arguments`);
        }

        const typeNamespace = genericTypeTokens.keys().next().value;
        const typeAccessors = genericTypeTokens.get(typeNamespace)!;
        genericArgs.push([typeNamespace, ...typeAccessors].join('.'));
      }
    }

    const accessorTokens = this.visitNext(node.typeName, context);
    if (!accessorTokens || accessorTokens.size !== 1) {
      throw Error(`Failed to parse the type reference name`);
    }

    const accessorNamespace = accessorTokens.keys().next().value;
    const accessors = accessorTokens.get(accessorNamespace)!;
    const genericArgsResult: string[] = [];
    if (genericArgs.length !== 0) {
      genericArgsResult.push(genericArgs.join(', '));
    }

    return new Map<string, string[]>([
      [[accessorNamespace, ...accessors].join('.'), genericArgsResult]
    ]);
  }

}