import { Node, SyntaxKind, SyntaxList } from 'typescript';
import { NodeVisitorBase } from './nodeVisitor';
import { GeneratorContext } from '../generatorContext';

export default class SyntaxListVisitor extends NodeVisitorBase<SyntaxList> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.SyntaxList;
  }

  doVisit(node: SyntaxList, context: GeneratorContext): void {
    const children = node.getChildren();
    for(const child of children) {
      this.visitNext(child, context);
    }
  }
}