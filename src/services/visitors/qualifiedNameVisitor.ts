import { Identifier, TSQualifiedName } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitor from '../../interfaces/expressionVisitor';
import Expression from '../../interfaces/expression';
import { GeneratorContext } from '../../interfaces/generatorContext';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';

export default class QualifiedNameVisitor implements ExpressionVisitor {
  visit(expression: Expression, context: GeneratorContext): string[] {
    if (expression.type === AST_NODE_TYPES.Identifier) {
      const id = expression as Identifier;
      return [id.name];
    }

    const values: string[] = [];
    if (expression.type === AST_NODE_TYPES.TSQualifiedName) {
      const qualifiedName = expression as TSQualifiedName;
      values.push(...this.visit(qualifiedName.left, context));
      values.push(...this.visit(qualifiedName.right, context));
    }

    return values;
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.TSQualifiedName || expression.type === AST_NODE_TYPES.Identifier;
  }
}