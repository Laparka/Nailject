import { NodeVisitorBase } from './nodeVisitor';
import { ImportClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class ImportClauseVisitor extends NodeVisitorBase<ImportClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportClause;
  }

  doVisit(node: ImportClause, context: GeneratorContext): NodeResult {
    if (node.name) {
      const nameResult = this.visitNext(node.name, context);
      if (!nameResult) {
        throw Error("The ImportClause name must contain only 1 element");
      }

      return nameResult;
    }

    if (node.namedBindings) {
      const bindingResult = this.visitNext(node.namedBindings, context);
      if (!bindingResult) {
        throw Error(`Failed to parse the import named bindings`);
      }

      return bindingResult;
    }

    throw Error(`Invalid ImportClause declaration. Name and Named Bindings are empty`)
  }
}