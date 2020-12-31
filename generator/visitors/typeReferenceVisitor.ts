import { NodeVisitorBase } from './nodeVisitor';
import { Node, SyntaxKind, TypeReferenceNode } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class TypeReferenceVisitor extends NodeVisitorBase<TypeReferenceNode> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.TypeReference;
  }

  doVisit(node: TypeReferenceNode, context: GeneratorContext): NodeResult {
    const genericArgs: NodeResult[] = [];
    if (node.typeArguments) {
      for (let i = 0; i < node.typeArguments.length; i++) {
        const genericTypeTokens = this.visitNext(node.typeArguments[i], context);
        if (!genericTypeTokens) {
          throw Error(`Failed to parse the type's generic arguments`);
        }

        genericArgs.push(genericTypeTokens);
      }
    }

    const accessorTokens = this.visitNext(node.typeName, context);
    if (!accessorTokens) {
      throw Error(`Failed to parse the type reference name`);
    }

    accessorTokens.typeNames = genericArgs;
    return accessorTokens;
  }

}