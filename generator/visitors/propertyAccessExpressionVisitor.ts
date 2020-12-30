import { NodeVisitorBase } from './nodeVisitor';
import { Node, PropertyAccessExpression, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class PropertyAccessExpressionVisitor extends NodeVisitorBase<PropertyAccessExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.PropertyAccessExpression;
  }

  doVisit(node: PropertyAccessExpression, context: GeneratorContext): Map<string, string[]> {
    const instanceTokens = this.visitNext(node.expression, context);
    if (!instanceTokens || instanceTokens.size !== 1) {
      throw Error(`The instance property is not defined`);
    }

    const instanceAccessorNamespace = instanceTokens.keys().next().value;
    const instanceAccessorProperty = instanceTokens.get(instanceAccessorNamespace)!;
    if (instanceAccessorProperty.length !== 0) {
      throw Error("PropertyAccessExpression-expression must be a single object");
    }

    const propertyTokens = this.visitNext(node.name, context);
    if (!propertyTokens || propertyTokens.size !== 1) {
      throw Error(`Property accessor is missing or multiple results were returned`);
    }

    const propertyNamespace = propertyTokens.keys().next().value;
    return new Map<string, string[]>([
        [[instanceAccessorNamespace, propertyNamespace].join('.'), []]
      ]
    );
  }
}