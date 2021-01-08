import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
import { assignAccessorImport, tokenizePropertyAccessor } from '../utils';

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

      const interfaceNameTokens = tokenizePropertyAccessor(interfaceAccessor);
      if (interfaceNameTokens.length !== 0 && interfaceNameTokens[interfaceNameTokens.length - 1] === 'DependenciesRegistration') {
        const interfaceImport = assignAccessorImport(interfaceAccessor, context.imports);
        if (interfaceImport) {
          // TODO: Find a better way to assert the valid path
          if (interfaceImport.from.path.endsWith(dependenciesRegistrationDir)) {
            return interfaceAccessor;
          }
        }
      }
    }
  }
}