import { Node, SyntaxKind, SyntaxList } from 'typescript';
import { NodeVisitorBase } from './nodeVisitor';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class SyntaxListVisitor extends NodeVisitorBase<SyntaxList> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.SyntaxList;
  }

  doVisit(node: SyntaxList, context: GeneratorContext): void {
    const children = node.getChildren();
    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      this.visitNext(child, context);
    }
  }
}