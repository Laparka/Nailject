import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, ImportType, NodeResult } from '../generatorContext';
import { getLastPropertyAccessor, tryFindImportType } from '../utils';

export default class HeritageClauseVisitor extends NodeVisitorBase<HeritageClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.HeritageClause;
  }

  doVisit(node: HeritageClause, context: GeneratorContext): NodeResult | void {
    if (node.token !== SyntaxKind.ImplementsKeyword || node.modifiers) {
      return;
    }

    for(let i = 0; i < node.types.length; i++) {
      const type = node.types[i];
      const typeTokens = this.visitNext(type, context);
      if (!typeTokens) {
        throw Error(`Invalid inheritance type`);
      }

      if (HeritageClauseVisitor.hasImport(typeTokens.name, context.imports) && getLastPropertyAccessor(typeTokens) === 'DependenciesRegistration') {
        return typeTokens;
      }
    }
  }

  private static hasImport(name: string, imports: ImportType[]): boolean {
    return !!tryFindImportType(name, imports);
  }
}