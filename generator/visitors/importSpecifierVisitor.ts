import { NodeVisitorBase } from './nodeVisitor';
import { ImportSpecifier, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';

export default class ImportSpecifierVisitor extends NodeVisitorBase<ImportSpecifier> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportSpecifier;
  }

  doVisit(node: ImportSpecifier, context: GeneratorContext): CodeAccessor {
    let propertyName: CodeAccessor | null = null;
    if (node.propertyName) {
      const propertyNameAccessor = this.visitNext(node.propertyName, context) as CodeAccessor;
      if (!propertyNameAccessor || !propertyNameAccessor.name) {
        throw Error("The import specifier property name is not defined");
      }

      propertyName = propertyNameAccessor;
    }

    const name = this.visitNext(node.name, context) as CodeAccessor;
    if (!name || !name.name) {
      throw Error("The import specifier name is not defined")
    }

    let typeName = name.name;
    let child: CodeAccessor | undefined = undefined;
    if (propertyName) {
      typeName = propertyName.name;
      child = name;
    }

    return {
      name: typeName,
      child: child
    };
  }

}