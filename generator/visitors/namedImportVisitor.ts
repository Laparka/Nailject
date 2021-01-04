import { NodeVisitorBase } from './nodeVisitor';
import { NamedImports, Node, SyntaxKind } from 'typescript';
import { CodeAccessor, GeneratorContext, ImportFrom } from '../generatorContext';

export default class NamedImportVisitor extends NodeVisitorBase<NamedImports> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.NamedImports;
  }

  doVisit(node: NamedImports, context: GeneratorContext): ImportFrom[] {
    const specifiers: ImportFrom[] = [];
    for (let i = 0; i < node.elements.length; i++) {
      const importSpecifierAccessor = this.visitNext(node.elements[i], context) as CodeAccessor;
      if (!importSpecifierAccessor || !importSpecifierAccessor.name) {
        throw Error("Named import specifier is empty");
      }

      specifiers.push({
        kind: 'Named',
        path: '',
        name: importSpecifierAccessor.name,
        alias: importSpecifierAccessor.child ? importSpecifierAccessor.child.name : importSpecifierAccessor.name
      });
    }

    return specifiers;
  }
}