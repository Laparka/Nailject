import { NodeVisitorBase } from './nodeVisitor';
import { NamedImports, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class NamedImportVisitor extends NodeVisitorBase<NamedImports> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.NamedImports;
  }

  doVisit(node: NamedImports, context: GeneratorContext): Map<string, string[]> {
    const result = new Map<string, string[]>();
    for(let i = 0; i < node.elements.length; i++) {
      const elementResult = this.visitNext(node.elements[0], context);
      if (!elementResult || elementResult.size !== 1) {
        throw Error("Named import specifier is empty");
      }

      const elementKey = elementResult.keys().next().value;
      const elementValues = elementResult.get(elementKey)!;
      let emptyKey = result.get(elementKey);
      if (!emptyKey) {
        emptyKey = [];
        result.set(elementKey, emptyKey);
      }

      emptyKey.push(...elementValues);
    }

    return result;
  }

}