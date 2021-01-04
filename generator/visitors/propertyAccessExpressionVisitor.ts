import { NodeVisitorBase } from './nodeVisitor';
import { Node, PropertyAccessExpression, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

export default class PropertyAccessExpressionVisitor extends NodeVisitorBase<PropertyAccessExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.PropertyAccessExpression;
  }

  doVisit(node: PropertyAccessExpression, context: GeneratorContext): CodeAccessor {
    const instanceTokens = this.visitNext(node.expression, context);
    if (!instanceTokens) {
      throw Error(`The instance property is not defined`);
    }

    const propertyTokens = this.visitNext(node.name, context);
    if (!propertyTokens) {
      throw Error(`Property accessor is missing or multiple results were returned`);
    }

    return  {
      name: instanceTokens.name,
      child: propertyTokens
    };
  }
}