import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
import { getNormalizedImport, tryFindImportByAccessor } from '../utils';

const dependenciesRegistrationDir = 'api/dependenciesRegistration';
export default class HeritageClauseVisitor extends NodeVisitorBase<HeritageClause> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.HeritageClause;
  }

  doVisit(node: HeritageClause, context: GeneratorContext): CodeAccessor | void {
    if (node.token !== SyntaxKind.ImplementsKeyword || node.modifiers) {
      return;
    }

    for(const type of node.types) {
      const interfaceAccessor = this.visitNext(type, context) as CodeAccessor;
      if (!interfaceAccessor || !interfaceAccessor.name) {
        throw Error(`Invalid inheritance type`);
      }

      const importDefinition = tryFindImportByAccessor(interfaceAccessor, context.imports);
      if (!importDefinition) {
        continue;
      }

      interfaceAccessor.importFrom = importDefinition;
      const normalizedImport = getNormalizedImport(interfaceAccessor);
      if (!normalizedImport) {
        continue;
      }

      if (normalizedImport.name === 'DependenciesRegistration' && normalizedImport.path.endsWith(dependenciesRegistrationDir)) {
        return interfaceAccessor;
      }
    }
  }
}