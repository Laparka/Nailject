import { NodeVisitorBase } from './nodeVisitor';
import { Node, QualifiedName, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

export default class QualifiedNameVisitor extends NodeVisitorBase<QualifiedName> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.QualifiedName;
  }

  doVisit(node: QualifiedName, context: GeneratorContext): CodeAccessor {
    const leftTokens = this.visitNext(node.left, context);
    if (!leftTokens) {
      throw Error(`Failed to parse the left-expression of the qualified token`);
    }

    const rightTokens = this.visitNext(node.right, context);
    if (!rightTokens) {
      throw Error(`Failed to parse the right-expression of the qualified token`);
    }

    leftTokens.child = rightTokens;
    return leftTokens;
  }

}