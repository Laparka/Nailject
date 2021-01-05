import { NodeVisitorBase } from './nodeVisitor';
import { ClassDeclaration, Node, SyntaxKind } from 'typescript';
import { CodeAccessor, GeneratorContext } from '../generatorContext';

export default class ClassDeclarationVisitor extends NodeVisitorBase<ClassDeclaration> {
  canVisit(node: Node): boolean {
    if (node.kind === SyntaxKind.ClassDeclaration) {
      if (node.modifiers) {
        return node.modifiers.findIndex(_ => _.kind === SyntaxKind.ExportKeyword) >= 0;
      }
    }

    return false;
  }

  doVisit(node: ClassDeclaration, context: GeneratorContext): void {
    if (!node.name) {
      return;
    }
    const classNameCodeAccessor = this.visitNext(node.name, context) as CodeAccessor;
    if (!classNameCodeAccessor || !classNameCodeAccessor.name) {
      throw Error("The class name is not defined");
    }

    if (context.instanceName !== classNameCodeAccessor.name) {
      return;
    }

    if (context.mode === 'Module') {
      if (!node.heritageClauses) {
        return;
      }

      let implementRegistration = false;
      for(const heritageClause of node.heritageClauses) {
        const inheritCodeAccessor = this.visitNext(heritageClause, context) as CodeAccessor;
        if (inheritCodeAccessor && inheritCodeAccessor.name) {
          implementRegistration = true;
          break;
        }
      }

      if (!implementRegistration) {
        return;
      }
    }
    else if (context.mode !== 'Dependent') {
      return;
    }

    for(const member of node.members) {
      this.visitNext(member, context)
    }
  }

}