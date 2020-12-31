import { NodeVisitorBase } from './nodeVisitor';
import { CallExpression, Node, SyntaxKind } from 'typescript';
import {
  GeneratorContext,
  ImportType,
  ServiceResolverDeclaration,
} from '../generatorContext';
import { LifetimeScope } from '../../api/containerBuilder';
import { addUsedImports } from '../utils';

export default class CallExpressionVisitor extends NodeVisitorBase<CallExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.CallExpression;
  }

  doVisit(node: CallExpression, context: GeneratorContext): void {
    if (node.arguments.length !== 1 || !node.typeArguments || node.typeArguments.length !== 2) {
      return;
    }

    const methodCallTokens = this.visitNext(node.expression, context);
    if (!methodCallTokens) {
      return;
    }

    const instanceName = methodCallTokens.name;
    if (instanceName !== context.instanceName) {
      return;
    }

    if (!methodCallTokens.child) {
      return;
    }

    const typeSymbolNode = this.visitNext(node.arguments[0], context);
    if (!typeSymbolNode) {
      throw Error(`Registration type-symbol was not found`);
    }

    let scope: LifetimeScope;
    switch (methodCallTokens.child.name) {
      case 'addSingleton': {
        scope = 'Singleton';
        break;
      }

      case 'addTransient': {
        scope = 'Transient';
        break;
      }

      default: {
        throw new Error(`Not supported registration-method ${methodCallTokens.child.name}`);
      }
    }

    const serviceTypeNode = this.visitNext(node.typeArguments[0], context);
    if (!serviceTypeNode) {
      throw Error(`No service type argument is defined for the ${methodCallTokens.child.name}-method`)
    }

    const usedImports: ImportType[] = [];
    addUsedImports(serviceTypeNode, context.imports, usedImports);
    addUsedImports({name: typeSymbolNode.name, typeNames: [], child: null}, context.imports, usedImports);
    const instanceTypeNode = this.visitNext(node.typeArguments[1], context);
    if (!instanceTypeNode) {
      throw Error(`No instance type argument is defined for the ${methodCallTokens.child.name}-method`)
    }

    const instanceImport = addUsedImports(instanceTypeNode, context.imports, usedImports);
    if (!instanceImport) {
      throw Error(`The instance class must be exportable and located outside of the registration module`)
    }

    const resolverDeclaration: ServiceResolverDeclaration = {
      scope: scope,
      imports: usedImports,
      typeSymbolNode: typeSymbolNode,
      instanceTypeNode: {
        type: instanceTypeNode,
        path: instanceImport
      },
      serviceTypeNode: serviceTypeNode
    };

    context.resolvers.push(resolverDeclaration);
  }
}