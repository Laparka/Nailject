import { NodeVisitorBase } from './nodeVisitor';
import { MethodDeclaration, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class MethodDeclarationVisitor extends NodeVisitorBase<MethodDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.MethodDeclaration;
  }

  doVisit(node: MethodDeclaration, context: GeneratorContext): Map<string, string[]> | undefined {
    if (node.modifiers || node.parameters.length !== 1 || !node.body) {
      return;
    }

    const nameTokens = this.visitNext(node.name, context);
    if (!nameTokens || nameTokens.size !== 1) {
      throw Error(`Failed to parse the method name`);
    }

    const methodName = nameTokens.keys().next().value;
    if (methodName !== 'register') {
      return;
    }

    const parameterTokens = this.visitNext(node.parameters[0], context);
    if (!parameterTokens || parameterTokens.size !== 1) {
      return;
    }

    const argumentName = parameterTokens.keys().next().value;
    if (context.instanceName !== argumentName) {
      return;
    }

    for(let i = 0; i < node.body.statements.length; i++) {
      this.visitNext(node.body.statements[i], context);
    }

    return;
  }

}