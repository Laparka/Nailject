import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class TypeArgumentVisitor extends NodeVisitorBase<ExpressionWithTypeArguments> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ExpressionWithTypeArguments;
  }

  doVisit(node: ExpressionWithTypeArguments, context: GeneratorContext): NodeResult | void {
    const genericArgs: NodeResult[] = [];
    if (node.typeArguments) {
      for(let i = 0; i < node.typeArguments.length; i++) {
        const typeArgTokens = this.visitNext(node.typeArguments[i], context);
        if (!typeArgTokens) {
          throw Error(`Failed to generate Generic Type Arguments`);
        }

        genericArgs.push(typeArgTokens);
      }
    }

    const accessorTokens = this.visitNext(node.expression, context);
    if (!accessorTokens) {
      throw Error(`Failed to parse the type name`);
    }

    if (accessorTokens.typeNames.length !== 0) {
      throw Error(`The accessor expression cannot have generic arguments. Property access name ${accessorTokens.name}`);
    }

    accessorTokens.typeNames = genericArgs;
    return accessorTokens;
  }
}