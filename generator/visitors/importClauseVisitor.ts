import { NodeVisitorBase } from './nodeVisitor';
import { ImportClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor, ImportFrom } from '../generatorContext';

export default class ImportClauseVisitor extends NodeVisitorBase<ImportClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportClause;
  }

  doVisit(node: ImportClause, context: GeneratorContext): ImportFrom[] {
    if (node.name) {
      const nameResult = this.visitNext(node.name, context) as CodeAccessor;
      if (!nameResult || !nameResult.name) {
        throw Error("Failed to parse the import clause name token");
      }

      return [{
        path: '',
        kind: 'Default',
        alias: nameResult.name,
        name: nameResult.name,
        isExternal: false
      }];
    }

    if (node.namedBindings) {
      const bindingResult = this.visitNext(node.namedBindings, context) as ImportFrom[];
      if (!bindingResult) {
        throw Error(`Failed to parse the import named bindings`);
      }

      return bindingResult;
    }

    throw Error(`Invalid ImportClause declaration. Name and Named Bindings are empty`)
  }
}