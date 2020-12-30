import { NodeVisitorBase } from './nodeVisitor';
import { NamespaceImport, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class NamespaceImportVisitor extends NodeVisitorBase<NamespaceImport> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.NamespaceImport;
  }

  doVisit(node: NamespaceImport, context: GeneratorContext): Map<string, string[]> {
    const id = this.visitNext(node.name, context);
    if (!id || id.size !== 1) {
      throw Error("Namespace Import must have only 1 specifier");
    }

    return new Map<string, string[]>([
      ["*", [id.keys().next().value]]
    ]);
  }
}