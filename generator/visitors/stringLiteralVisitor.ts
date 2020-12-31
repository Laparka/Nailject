import { NodeVisitorBase } from './nodeVisitor';
import { Node, StringLiteral, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class StringLiteralVisitor extends NodeVisitorBase<StringLiteral> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.StringLiteral;
  }

  doVisit(node: StringLiteral, context: GeneratorContext): NodeResult {
    return {
      name: node.text,
      child: null,
      typeNames: []
    }
  }

}