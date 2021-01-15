import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

const dependenciesRegistrationDir = 'pileuple-api/dependenciesRegistration';
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
      if (!interfaceAccessor) {
        throw Error(`Invalid inheritance type`);
      }

      if (!interfaceAccessor.importFrom) {
        continue;
      }

      if (interfaceAccessor.importFrom.normalized.name !== 'DependenciesRegistration') {
        continue;
      }

      if (interfaceAccessor.importFrom.normalized.path === dependenciesRegistrationDir) {
        return interfaceAccessor;
      }
    }
  }
}