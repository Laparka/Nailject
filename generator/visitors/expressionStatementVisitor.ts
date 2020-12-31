import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionStatement, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class ExpressionStatementVisitor extends NodeVisitorBase<ExpressionStatement> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ExpressionStatement;
  }

  doVisit(node: ExpressionStatement, context: GeneratorContext): void {
    const callTokens = this.visitNext(node.expression, context)
  }

}