import { NodeVisitorBase } from './nodeVisitor';
import { MethodDeclaration, Node, SyntaxKind } from 'typescript';
import { CodeAccessor, GeneratorContext } from '../generatorContext';

export default class MethodDeclarationVisitor extends NodeVisitorBase<MethodDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.MethodDeclaration;
  }

  doVisit(node: MethodDeclaration, context: GeneratorContext): void {
    if (node.modifiers || node.parameters.length !== 1 || !node.body) {
      return;
    }

    const nameTokens = this.visitNext(node.name, context) as CodeAccessor;
    if (!nameTokens) {
      throw Error(`Failed to parse the method name`);
    }

    if (nameTokens.name !== 'register') {
      return;
    }

    const parameterTokens = this.visitNext(node.parameters[0], context);
    if (!parameterTokens) {
      return;
    }

    for (const bodyStatement of node.body.statements) {
      this.visitNext(bodyStatement, context);
    }
  }
}