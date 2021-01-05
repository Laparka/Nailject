import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor, ImportFrom } from '../generatorContext';
import { getLastPropertyAccessor, tryFindImportType } from '../utils';

export default class HeritageClauseVisitor extends NodeVisitorBase<HeritageClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.HeritageClause;
  }

  doVisit(node: HeritageClause, context: GeneratorContext): CodeAccessor | void {
    if (node.token !== SyntaxKind.ImplementsKeyword || node.modifiers) {
      return;
    }

    for(const type of node.types) {
      const typeCodeAccessor = this.visitNext(type, context) as CodeAccessor;
      if (!typeCodeAccessor || !typeCodeAccessor.name) {
        throw Error(`Invalid inheritance type`);
      }

      if (HeritageClauseVisitor.hasImport(typeCodeAccessor.name, context.imports) && getLastPropertyAccessor(typeCodeAccessor) === 'DependenciesRegistration') {
        return typeCodeAccessor;
      }
    }
  }

  private static hasImport(name: string, imports: ImportFrom[]): boolean {
    return !!tryFindImportType(name, imports);
  }
}