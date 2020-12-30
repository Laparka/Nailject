import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, ImportType } from '../generatorContext';
import { tryFindImportType } from '../utils';

export default class HeritageClauseVisitor extends NodeVisitorBase<HeritageClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.HeritageClause;
  }

  doVisit(node: HeritageClause, context: GeneratorContext): Map<string, string[]> | undefined {
    if (node.token !== SyntaxKind.ImplementsKeyword || node.modifiers) {
      return;
    }

    for(let i = 0; i < node.types.length; i++) {
      const type = node.types[i];
      const typeTokens = this.visitNext(type, context);
      if (!typeTokens || typeTokens.size !== 1) {
        throw Error(`Invalid inheritance type`);
      }

      const typeName = typeTokens.keys().next().value;
      const typeNameTokens = typeName.split(/[.]/g);
      if (HeritageClauseVisitor.hasImport(typeNameTokens[0], context.imports) && typeNameTokens[typeNameTokens.length - 1] === 'DependenciesRegistration') {
        return typeTokens;
      }
    }
  }

  private static hasImport(name: string, imports: ImportType[]): boolean {
    return !!tryFindImportType(name, imports);
  }
}