import { NodeVisitorBase } from './nodeVisitor';
import { Node, StringLiteral, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

export default class StringLiteralVisitor extends NodeVisitorBase<StringLiteral> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.StringLiteral;
  }

  doVisit(node: StringLiteral, context: GeneratorContext): CodeAccessor {
    return {
      name: node.text
    }
  }

}