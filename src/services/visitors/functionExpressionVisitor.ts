import { FunctionExpression, Identifier } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';

export default class FunctionExpressionVisitor extends ExpressionVisitorBase<FunctionExpression> {
  visitExpression(expression: FunctionExpression, context: GeneratorContext): string[] {
    const result: string[] = [];
    if (!!context.instanceName) {
      return result;
    }

    if (expression.body.body.length === 0) {
      return result;
    }

    if (expression.params.length !== 1) {
      return result;
    }

    if (expression.params[0].type !== AST_NODE_TYPES.Identifier) {
      return result;
    }

    const param = expression.params[0] as Identifier;
    if (!param.typeAnnotation || param.typeAnnotation.typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference) {
      return result;
    }

    const typeName = this.rootVisitor.visit(param.typeAnnotation.typeAnnotation.typeName, context) as string[];
    if (!typeName || typeName.length === 0 || typeName[typeName.length - 1] !== "ContainerBuilder") {
      return result;
    }

    context.instanceName = param.name;
    for(let i = 0; i < expression.body.body.length; i++) {
      const bodyBlock = expression.body.body[i];
      result.push(...this.rootVisitor.visit(bodyBlock, context));
    }

    return result;
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.FunctionExpression;
  }
}