import { NodeVisitorBase } from './nodeVisitor';
import { Identifier, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class IdentifierVisitor extends NodeVisitorBase<Identifier> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.Identifier;
  }

  doVisit(node: Identifier, context: GeneratorContext): Map<string, string[]> {
    return new Map<string, string[]>([
      [node.escapedText.toString(), []]
    ]);
  }

}