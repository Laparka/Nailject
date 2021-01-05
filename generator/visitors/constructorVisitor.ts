import { NodeVisitorBase } from './nodeVisitor';
import { ConstructorDeclaration, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class ConstructorVisitor extends NodeVisitorBase<ConstructorDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.Constructor;
  }

  doVisit(node: ConstructorDeclaration, context: GeneratorContext): void {
    if (context.mode !== 'Dependent' || node.parameters.length === 0) {
      return;
    }

    for(const parameter of node.parameters) {
      this.visitNext(parameter, context);
    }
  }
}