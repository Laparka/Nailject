import { NodeVisitorBase } from './nodeVisitor';
import { Node, SyntaxKind, TypeReferenceNode } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

export default class TypeReferenceVisitor extends NodeVisitorBase<TypeReferenceNode> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.TypeReference;
  }

  doVisit(node: TypeReferenceNode, context: GeneratorContext): CodeAccessor {
    const genericArgs: CodeAccessor[] = [];
    if (node.typeArguments) {
      for (let i = 0; i < node.typeArguments.length; i++) {
        const genericTypeAccessor = this.visitNext(node.typeArguments[i], context) as CodeAccessor;
        if (!genericTypeAccessor || !genericTypeAccessor.name) {
          throw Error(`Failed to parse the type's generic arguments`);
        }

        genericArgs.push(genericTypeAccessor);
      }
    }

    const accessorTokens = this.visitNext(node.typeName, context) as CodeAccessor;
    if (!accessorTokens || !accessorTokens.name) {
      throw Error(`Failed to parse the type reference name`);
    }

    accessorTokens.typeNames = genericArgs;
    return accessorTokens;
  }

}