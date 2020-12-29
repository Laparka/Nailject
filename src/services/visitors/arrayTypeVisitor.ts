import { TSArrayType } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import Expression from '../../interfaces/expression';
import { GeneratorContext } from '../../interfaces/generatorContext';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';

export default class ArrayTypeVisitor extends ExpressionVisitorBase<TSArrayType> {
  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.TSArrayType;
  }

  visitExpression(expression: TSArrayType, context: GeneratorContext): string[] {
    const elementType = this.rootVisitor.visit(expression.elementType, context);
    return [`${elementType}[]`];
  }

}