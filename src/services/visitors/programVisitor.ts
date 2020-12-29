import { Program } from '@typescript-eslint/types/dist/ts-estree';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import ExpressionVisitorBase from './expressionVisitorBase';
import { GeneratorContext } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';

export default class ProgramVisitor extends ExpressionVisitorBase<Program> {
  visitExpression(expression: Program, context: GeneratorContext): string[] {
    const result: string[] = [];
    for(let i = 0; i < expression.body.length; i++) {
      const bodyStatement = expression.body[i];
      result.push(...this.rootVisitor.visit(bodyStatement, context));
    }

    return result;
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.Program;
  }
}