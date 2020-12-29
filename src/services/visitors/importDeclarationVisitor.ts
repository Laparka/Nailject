import ExpressionVisitorBase from './expressionVisitorBase';
import { ImportDeclaration, ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier, StringLiteral } from '@typescript-eslint/types/dist/ts-estree';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { GeneratorContext } from '../../interfaces/generatorContext';
import * as path from 'path';
import Expression from '../../interfaces/expression';

export default class ImportDeclarationVisitor extends ExpressionVisitorBase<ImportDeclaration> {
  visitExpression(expression: ImportDeclaration, context: GeneratorContext): string[] {
    const source = (expression.source as StringLiteral).value;
    if (!source) {
      throw Error("The import source was not found");
    }

    const importPath = path.join(path.parse(context.modulePath).dir, source);
    if (!context.import.has(importPath)) {
      context.import.set(importPath, []);
    }

    const imported = context.import.get(importPath)!;
    for(let i = 0; i < expression.specifiers.length; i++) {
      const specifier = expression.specifiers[i];
      switch (specifier.type) {
        case AST_NODE_TYPES.ImportDefaultSpecifier: {
          const importSpecifier = specifier as ImportDefaultSpecifier;
          imported.push({
            name: importSpecifier.local.name,
            alias: "",
            kind: "Default"
          });

          break;
        }

        case AST_NODE_TYPES.ImportNamespaceSpecifier: {
          const importSpecifier = specifier as ImportNamespaceSpecifier;
          imported.push({
            name: "",
            alias: importSpecifier.local.name,
            kind: "Namespace"
          });

          break;
        }

        case AST_NODE_TYPES.ImportSpecifier: {
          const importSpecifier = specifier as ImportSpecifier;
          imported.push({
            alias: importSpecifier.local.name,
            name: importSpecifier.imported.name,
            kind: "Named"
          });

          break;
        }
      }
    }

    return [];
  }

  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.ImportDeclaration;
  }
}