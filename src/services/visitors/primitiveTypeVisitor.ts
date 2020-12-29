import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';
import ExpressionVisitor from '../../interfaces/expressionVisitor';

export default class PrimitiveTypeVisitor implements ExpressionVisitor {
  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.TSBooleanKeyword
      || expression.type === AST_NODE_TYPES.TSStringKeyword
      || expression.type === AST_NODE_TYPES.TSBigIntKeyword
      || expression.type === AST_NODE_TYPES.TSNumberKeyword;
  }

  visit(expression: Expression, context: GeneratorContext): string[] {
    switch (expression.type) {
      case AST_NODE_TYPES.TSStringKeyword: {
        return ["string"];
      }

      case AST_NODE_TYPES.TSNumberKeyword: {
        return ["number"];
      }

      case AST_NODE_TYPES.TSBigIntKeyword: {
        return ["bigint"];
      }

      case AST_NODE_TYPES.TSBooleanKeyword: {
        return ["boolean"];
      }
    }

    throw Error(`Not supported primitive type ${expression.type}`);
  }
}