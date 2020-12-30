import { NodeVisitorBase } from './nodeVisitor';
import { ImportSpecifier, Node, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';

export default class ImportSpecifierVisitor extends NodeVisitorBase<ImportSpecifier> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportSpecifier;
  }

  doVisit(node: ImportSpecifier, context: GeneratorContext): Map<string, string[]> {
    let propertyName: string = "";
    if (node.propertyName) {
      const propertyNames = this.visitNext(node.propertyName, context);
      if (!propertyNames || propertyNames.size !== 1) {
        throw Error("The import specifier property name is not defined");
      }

      propertyName = propertyNames.keys().next().value;
    }

    const name = this.visitNext(node.name, context);
    if (!name || name.size !== 1) {
      throw Error("The import specifier name is not defined")
    }


    return new Map<string, string[]>([
      [propertyName, [name.keys().next().value]]
    ]);
  }

}