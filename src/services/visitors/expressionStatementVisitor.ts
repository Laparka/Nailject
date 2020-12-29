import { ExpressionStatement } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';

export default class ExpressionStatementVisitor extends ExpressionVisitorBase<ExpressionStatement> {
  visitExpression(expression: ExpressionStatement, context: GeneratorContext): string[] {
    if (!expression.expression) {
      return [];
    }

    return this.rootVisitor.visit(expression.expression, context);
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.ExpressionStatement;
  }
}