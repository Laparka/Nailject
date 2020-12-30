import { NodeVisitorBase } from './nodeVisitor';
import { ImportDeclaration, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, ImportType } from '../generatorContext';
import * as path from 'path';

export default class ImportDeclarationVisitor extends NodeVisitorBase<ImportDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportDeclaration;
  }

  doVisit(node: ImportDeclaration, context: GeneratorContext): undefined {
    if (!node.importClause) {
      return
    }

    const importClause = this.visitNext(node.importClause, context);
    if (!importClause) {
      throw Error("The ImportDeclaration has ImportClause missing");
    }

    const modulePath = this.visitNext(node.moduleSpecifier, context);
    if (!modulePath || modulePath.size !== 1) {
      throw Error("ImportDeclaration From-path must be the only one in the list");
    }

    let importPath = modulePath.keys().next().value;
    if (importPath.length !== 0 && importPath[0] === '.') {
      const moduleDir = path.parse(context.modulePath).dir;
      importPath = path.join(moduleDir, importPath).replace(/\\/g, '/');
      if (importPath.length !== 0 && importPath[0] !== '.') {
        importPath = './' + importPath;
      }
    }

    const iterator = importClause.keys();
    let next = iterator.next();
    while (next && !next.done) {
      const imported = importClause.get(next.value)!;
      const importType: ImportType = {
        alias: "",
        name: next.value,
        fromPackage: importPath[0] !== '.',
        path: importPath
      };

      if (imported.length === 1) {
        importType.alias = imported[0];
      }

      context.imports.push(importType);
      next = iterator.next();
    }
  }
}