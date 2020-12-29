import { ClassDeclaration } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { GeneratorContext } from '../../interfaces/generatorContext';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import Expression from '../../interfaces/expression';

export default class ClassDeclarationVisitor extends ExpressionVisitorBase<ClassDeclaration> {
  visitExpression(expression: ClassDeclaration, context: GeneratorContext): string[] {
    if (!expression.id) {
      throw Error("No class name is defined");
    }

    const result: string[] = [];
    const className = expression.id.name;
    if (!context.instanceName && context.mode === 'Aggregating' || context.instanceName === className && context.mode === 'Generating') {
      for (let i = 0; i < expression.body.body.length; i++) {
        const bodyBlock = expression.body.body[i];
        result.push(...this.rootVisitor.visit(bodyBlock, context));
      }
    }

    return result;
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.ClassDeclaration;
  }
}