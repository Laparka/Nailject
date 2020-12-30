import { NodeVisitorBase } from './nodeVisitor';
import { CallExpression, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';
import { LifetimeScope } from '../../api/containerBuilder';

export default class CallExpressionVisitor extends NodeVisitorBase<CallExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.CallExpression;
  }

  doVisit(node: CallExpression, context: GeneratorContext): Map<string, string[]> | undefined {
    if (node.arguments.length !== 1 || !node.typeArguments || node.typeArguments.length !== 2) {
      return;
    }

    const methodCallTokens = this.visitNext(node.expression, context);
    if (!methodCallTokens || methodCallTokens.size !== 1) {
      return;
    }

    const instanceName = methodCallTokens.keys().next().value;
    if (instanceName !== context.instanceName) {
      return;
    }

    const methodNameTokens = methodCallTokens.get(instanceName)!;
    if (methodNameTokens.length !== 1) {
      return;
    }

    let scope: LifetimeScope;
    switch (methodNameTokens[0]) {
      case 'addSingleton': {
        scope = 'Singleton';
        break;
      }

      case 'addTransient': {
        scope = 'Transient';
        break;
      }

      default: {
        throw new Error(`Not supported registration-method ${methodNameTokens[0]}`);
      }
    }

    const serviceTypeTokens = this.visitNext(node.typeArguments[0], context);
    const instanceTypeTokens = this.visitNext(node.typeArguments[1], context);
    const symbolTypeTokens = this.visitNext(node.arguments[0], context);
    throw Error(`I stopped here`)
  }

}