import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class TypeArgumentVisitor extends NodeVisitorBase<ExpressionWithTypeArguments> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ExpressionWithTypeArguments;
  }

  doVisit(node: ExpressionWithTypeArguments, context: GeneratorContext): Map<string, string[]> | undefined {
    const genericArgs: string[] = [];
    if (node.typeArguments) {
      for(let i = 0; i < node.typeArguments.length; i++) {
        const typeArgTokens = this.visitNext(node.typeArguments[i], context);
        if (!typeArgTokens || typeArgTokens.size !== 1) {
          throw Error(`Failed to generate Generic Type Arguments`);
        }

        const typeNamespace = typeArgTokens.keys().next().value;
        const typeAccessors = typeArgTokens.get(typeNamespace)!;
        genericArgs.push([typeNamespace, ...typeAccessors].join('.'));
      }
    }

    const accessorTokens = this.visitNext(node.expression, context);
    if (!accessorTokens || accessorTokens.size !== 1) {
      throw Error(`Failed to parse the type name`);
    }

    const namespace = accessorTokens.keys().next().value;
    const accessors = accessorTokens.get(namespace)!;

    const genericArgsResult: string[] = [];
    if (genericArgs.length !== 0) {
      genericArgsResult.push(`<${genericArgs.join(', ')}>`);
    }

    return new Map<string, string[]>([
      [[namespace, ...accessors].join('.'), genericArgsResult]
    ]);
  }
}