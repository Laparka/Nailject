import { MethodDefinition } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';

export default class MethodDefinitionVisitor extends ExpressionVisitorBase<MethodDefinition> {
  canVisit(expression: Expression): boolean {
    if (expression.type === AST_NODE_TYPES.MethodDefinition) {
      const method = expression as MethodDefinition;
      return method.kind === 'method'
        && !method.static
        && !method.computed
        && (!method.accessibility || method.accessibility === 'public')
        && method.key.type === AST_NODE_TYPES.Identifier;
    }

    return false;
  }

  visitExpression(expression: MethodDefinition, context: GeneratorContext): string[] {
    const result: string[] = [];
    const methodName = this.rootVisitor.visit(expression.key, context) as string[];
    if (!methodName || methodName.length !== 1 || methodName[methodName.length - 1] !== 'register') {
      return result;
    }

    return this.rootVisitor.visit(expression.value, context);
  }
}