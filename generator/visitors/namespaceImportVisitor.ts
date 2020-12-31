import { NodeVisitorBase } from './nodeVisitor';
import { NamespaceImport, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class NamespaceImportVisitor extends NodeVisitorBase<NamespaceImport> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.NamespaceImport;
  }

  doVisit(node: NamespaceImport, context: GeneratorContext): NodeResult {
    const id = this.visitNext(node.name, context);
    if (!id) {
      throw Error("Namespace Import must have only 1 specifier");
    }

    return {
      name: "*",
      child: {
        typeNames: [],
        child: null,
        name: id.name
      },
      typeNames: []
    };
  }
}