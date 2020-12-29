import { TSTypeReference } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import addUsedImport from './findAndAddImportDescriptor';
import Expression from '../../interfaces/expression';

export default class TypeReferenceVisitor extends ExpressionVisitorBase<TSTypeReference> {
  visitExpression(expression: TSTypeReference, context: GeneratorContext): string[] {
    // TODO: Add to Import all the namespaced types and generic implementations
    const typeName: string[] = [];
    if (expression.typeParameters) {
      const typeNodes = expression.typeParameters.params;
      for(let i = 0; i < typeNodes.length; i++) {
        const typeNode = typeNodes[i];
        const typeNameAccessor = this.rootVisitor.visit(typeNode, context) as string[]
        if (typeNameAccessor && typeNameAccessor.length !== 0) {
          typeName.push(...typeNameAccessor);
        }
      }
    }

    const accessorNames = this.rootVisitor.visit(expression.typeName, context) as string[];
    if (!accessorNames || accessorNames.length === 0) {
      throw Error(`Failed to find the type reference path`);
    }

    addUsedImport(accessorNames, context);
    if (typeName.length === 0) {
      return [accessorNames.join('.')];
    }

    return [accessorNames.join('.'), typeName.join('.')];
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.TSTypeReference;
  }
}