import { NodeVisitorBase } from './nodeVisitor';
import { Node, StringLiteral, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class StringLiteralVisitor extends NodeVisitorBase<StringLiteral> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.StringLiteral;
  }

  doVisit(node: StringLiteral, context: GeneratorContext): Map<string, string[]> {
    return new Map<string, string[]>([[node.text, []]]);
  }

}