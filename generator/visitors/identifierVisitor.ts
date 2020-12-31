import { NodeVisitorBase } from './nodeVisitor';
import { Identifier, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class IdentifierVisitor extends NodeVisitorBase<Identifier> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.Identifier;
  }

  doVisit(node: Identifier, context: GeneratorContext): NodeResult {
    return {
      name: node.escapedText.toString(),
      child: null,
      typeNames: []
    }
  }

}