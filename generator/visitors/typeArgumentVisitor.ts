import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

export default class TypeArgumentVisitor extends NodeVisitorBase<ExpressionWithTypeArguments> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ExpressionWithTypeArguments;
  }

  doVisit(node: ExpressionWithTypeArguments, context: GeneratorContext): CodeAccessor | void {
    const genericArgs: CodeAccessor[] = [];
    if (node.typeArguments) {
      for(const typeArg of node.typeArguments) {
        const genericTypeArgAccessor = this.visitNext(typeArg, context) as CodeAccessor;
        if (!genericTypeArgAccessor || !genericTypeArgAccessor.name) {
          throw Error(`Failed to generate Generic Type Arguments`);
        }

        genericArgs.push(genericTypeArgAccessor);
      }
    }

    const accessorTokens = this.visitNext(node.expression, context) as CodeAccessor;
    if (!accessorTokens) {
      throw Error(`Failed to parse the type name`);
    }

    if (accessorTokens.typeNames && accessorTokens.typeNames.length !== 0) {
      throw Error(`The accessor expression cannot have generic arguments. Property access name ${accessorTokens.name}`);
    }

    accessorTokens.typeNames = genericArgs;
    return accessorTokens;
  }
}