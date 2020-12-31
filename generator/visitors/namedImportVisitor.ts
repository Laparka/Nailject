import { NodeVisitorBase } from './nodeVisitor';
import { NamedImports, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class NamedImportVisitor extends NodeVisitorBase<NamedImports> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.NamedImports;
  }

  doVisit(node: NamedImports, context: GeneratorContext): NodeResult {
    const elements: NodeResult[] = [];
    for (let i = 0; i < node.elements.length; i++) {
      const elementResult = this.visitNext(node.elements[i], context);
      if (!elementResult) {
        throw Error("Named import specifier is empty");
      }

      elements.push(elementResult);
    }

    if (elements.length === 1) {
      return elements[0];
    }

    return {
      name: "",
      child: null,
      typeNames: elements
    };
  }
}