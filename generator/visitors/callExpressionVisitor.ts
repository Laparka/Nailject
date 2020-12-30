import { NodeVisitorBase } from './nodeVisitor';
import { CallExpression, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, ServiceResolverDeclaration } from '../generatorContext';
import { LifetimeScope } from '../../api/containerBuilder';

export default class CallExpressionVisitor extends NodeVisitorBase<CallExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.CallExpression;
  }

  doVisit(node: CallExpression, context: GeneratorContext): undefined {
    if (node.arguments.length !== 1 || !node.typeArguments || node.typeArguments.length !== 2) {
      return;
    }

    const methodCallTokens = this.visitNext(node.expression, context);
    if (!methodCallTokens || methodCallTokens.size !== 1) {
      return;
    }

    const instanceName = methodCallTokens.keys().next().value;
    const instanceNameTokens = instanceName.split(/[.]/g);
    if (instanceNameTokens.length != 2 || instanceNameTokens[0] !== context.instanceName) {
      return;
    }

    if (methodCallTokens.get(instanceName)!.length !== 0) {
      return;
    }

    let scope: LifetimeScope;
    switch (instanceNameTokens[1]) {
      case 'addSingleton': {
        scope = 'Singleton';
        break;
      }

      case 'addTransient': {
        scope = 'Transient';
        break;
      }

      default: {
        throw new Error(`Not supported registration-method ${instanceNameTokens[1]}`);
      }
    }

    const resolverDeclaration: ServiceResolverDeclaration = {
      context: context,
      dependencies: [],
      instanceType: [],
      serviceType: []
    };
    const serviceTypeTokens = this.addImport(node.typeArguments[0], resolverDeclaration);
    const instanceTypeTokens = this.addImport(node.typeArguments[1], resolverDeclaration);
    const symbolTypeTokens = this.addImport(node.arguments[0], resolverDeclaration);
  }

  private addImport(node: Node, resolverDeclaration: ServiceResolverDeclaration): Map<string, string[]> {
    const typeAccessTokens = this.visitNext(node, resolverDeclaration.context);
    if (!typeAccessTokens || typeAccessTokens.size !== 1) {
      throw Error(`Failed to parse the service resolver type arguments`)
    }

    const typeName = typeAccessTokens.keys().next().value;
    const genericArgs = typeAccessTokens.get(typeName)!;
    return typeAccessTokens;
  }
}