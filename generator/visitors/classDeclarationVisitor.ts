import { NodeVisitorBase } from './nodeVisitor';
import { ClassDeclaration, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

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
    const classNameTokens = this.visitNext(node.name, context);
    if (!classNameTokens) {
      throw Error("The class name is not defined");
    }

    if (context.instanceName !== classNameTokens.name) {
      return;
    }

    if (context.mode === 'Module') {
      if (!node.heritageClauses) {
        return;
      }

      let implementRegistration = false;
      for(let i = 0; i < node.heritageClauses.length; i++) {
        const inheritsTokens = this.visitNext(node.heritageClauses[i], context);
        if (inheritsTokens) {
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

    for(let i = 0; i < node.members.length; i++) {
      this.visitNext(node.members[i], context)
    }
  }

}