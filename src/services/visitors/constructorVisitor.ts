import ExpressionVisitorBase from './expressionVisitorBase';
import { FunctionExpression, Identifier, MethodDefinition } from '@typescript-eslint/types/dist/ts-estree';
import Expression from '../../interfaces/expression';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';

export default class ConstructorVisitor extends ExpressionVisitorBase<MethodDefinition> {
  canVisit(expression: Expression): boolean {
    if (expression.type === AST_NODE_TYPES.MethodDefinition) {
      const method = expression as MethodDefinition;
      return method.kind === 'constructor';
    }

    return false;
  }

  visitExpression(expression: MethodDefinition, context: GeneratorContext): string[] {
    const result: string[] = [];
    if (expression.value.type === AST_NODE_TYPES.FunctionExpression) {
      const funcExpr = expression.value as FunctionExpression;
      for(let i = 0; i < funcExpr.params.length; i++) {
        const param = funcExpr.params[i];
        if (param.type !== AST_NODE_TYPES.Identifier) {
          throw Error(`Not supported constructor argument type ${param.type}`);
        }

        const paramId = param as Identifier;
        if (!paramId.typeAnnotation) {
          throw Error(`Constructor argument is missing its type ${param.name}`);
        }

        const usedImportType = this.rootVisitor.visit(paramId.typeAnnotation.typeAnnotation, context);
        if (usedImportType.length === 1) {
          result.push(usedImportType[0]);
        }
        else {
          result.push(`${usedImportType[0]}<${usedImportType[1]}>`);
        }
      }
    }

    return result;
  }

}