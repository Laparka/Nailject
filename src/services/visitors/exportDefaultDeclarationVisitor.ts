import { ExportDefaultDeclaration } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import Expression from '../../interfaces/expression';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';

export default class ExportDefaultDeclarationVisitor extends ExpressionVisitorBase<ExportDefaultDeclaration> {
  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.ExportDefaultDeclaration;
  }

  visitExpression(expression: ExportDefaultDeclaration, context: GeneratorContext): string[] {
    return this.rootVisitor.visit(expression.declaration, context);
  }

}