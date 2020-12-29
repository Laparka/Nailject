import { ExportNamedDeclaration } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';

export default class ExportNamedDeclarationVisitor extends ExpressionVisitorBase<ExportNamedDeclaration> {
  visitExpression(expression: ExportNamedDeclaration, context: GeneratorContext): string[] {
    if (expression.declaration) {
      return this.rootVisitor.visit(expression.declaration, context);
    }

    throw Error(`Invalid export declaration`);
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.ExportNamedDeclaration;
  }
}