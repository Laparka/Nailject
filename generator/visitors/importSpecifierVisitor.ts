import { NodeVisitorBase } from './nodeVisitor';
import { ImportSpecifier, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class ImportSpecifierVisitor extends NodeVisitorBase<ImportSpecifier> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportSpecifier;
  }

  doVisit(node: ImportSpecifier, context: GeneratorContext): NodeResult {
    let propertyName: NodeResult | null = null;
    if (node.propertyName) {
      const propertyNames = this.visitNext(node.propertyName, context);
      if (!propertyNames) {
        throw Error("The import specifier property name is not defined");
      }

      propertyName = propertyNames;
    }

    const name = this.visitNext(node.name, context);
    if (!name) {
      throw Error("The import specifier name is not defined")
    }

    let typeName = name.name;
    let child: NodeResult | null = null;
    if (propertyName) {
      typeName = propertyName.name;
      child = name;
    }

    return {
      name: typeName,
      child: child,
      typeNames: []
    };
  }

}