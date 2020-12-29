import ExpressionVisitorBase from './expressionVisitorBase';
import { MemberExpression } from '@typescript-eslint/types/dist/ts-estree';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext, ImportType } from '../../interfaces/generatorContext';
import addUsedImport from './findAndAddImportDescriptor';
import Expression from '../../interfaces/expression';

export default class MemberExpressionVisitor extends ExpressionVisitorBase<MemberExpression> {
  visitExpression(expression: MemberExpression, context: GeneratorContext): string[] {
    const objectPath = this.rootVisitor.visit(expression.object, context) as string[];
    if (!objectPath || objectPath.length === 0) {
      throw Error(`No symbol type was found for the service registration`);
    }

    addUsedImport(objectPath, context);
    const property = this.rootVisitor.visit(expression.property, context) as string[];
    return [`${objectPath.join('.')}.${property.join('.')}`];
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.MemberExpression;
  }
}