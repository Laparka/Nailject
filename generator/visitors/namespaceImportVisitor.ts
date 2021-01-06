import { NodeVisitorBase } from './nodeVisitor';
import { NamespaceImport, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor, ImportFrom } from '../generatorContext';

export default class NamespaceImportVisitor extends NodeVisitorBase<NamespaceImport> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.NamespaceImport;
  }

  doVisit(node: NamespaceImport, context: GeneratorContext): ImportFrom[] {
    const id = this.visitNext(node.name, context) as CodeAccessor;
    if (!id || !id.name) {
      throw Error("Namespace Import must have only 1 specifier");
    }

    return [{
      name: '*',
      alias: id.name,
      path: '',
      kind: 'Namespace',
      isExternal: false
    }];
  }
}