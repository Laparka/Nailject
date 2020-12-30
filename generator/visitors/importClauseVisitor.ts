import { NodeVisitorBase } from './nodeVisitor';
import { ImportClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class ImportClauseVisitor extends NodeVisitorBase<ImportClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportClause;
  }

  doVisit(node: ImportClause, context: GeneratorContext): Map<string, string[]> {
    const result = new Map<string, string[]>();
    if (node.name) {
      const nameResult = this.visitNext(node.name, context);
      if (!nameResult || nameResult.size !== 1) {
        throw Error("The ImportClause name must contain only 1 element");
      }

      result.set(nameResult.keys().next().value, []);
    }
    else if (node.namedBindings) {
      const bindingResult = this.visitNext(node.namedBindings, context);
      if (!bindingResult || bindingResult.size !== 1) {
        throw Error("The ImportClause name binding must contain only 1 element");
      }

      const name = bindingResult.keys().next().value;
      result.set(name, bindingResult.get(name)!);
    }
    else {
      throw Error(`Invalid ImportClause declaration. Name and Named Bindings are empty`)
    }

    return result;
  }

}