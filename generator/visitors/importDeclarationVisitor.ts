import { NodeVisitorBase } from './nodeVisitor';
import { ImportDeclaration, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, ImportType } from '../generatorContext';
import * as path from 'path';
import { tryFindImportType } from '../utils';

export default class ImportDeclarationVisitor extends NodeVisitorBase<ImportDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportDeclaration;
  }

  doVisit(node: ImportDeclaration, context: GeneratorContext): void {
    if (!node.importClause) {
      return
    }

    const importClause = this.visitNext(node.importClause, context);
    if (!importClause) {
      throw Error("The ImportDeclaration has ImportClause missing");
    }

    const pathSpecifier = this.visitNext(node.moduleSpecifier, context);
    if (!pathSpecifier) {
      throw Error("ImportDeclaration From-path must be the only one in the list");
    }

    let importPath = pathSpecifier.name;
    if (importPath.length !== 0 && importPath[0] === '.') {
      const moduleDir = path.parse(context.modulePath).dir;
      importPath = path.join(moduleDir, importPath).replace(/\\/g, '/');
      if (importPath.length !== 0 && importPath[0] !== '.') {
        importPath = './' + importPath;
      }
    }

    const iterator = [...importClause.typeNames];
    if (iterator.length === 0) {
      iterator.push(importClause);
    }

    for(let i = 0; i < iterator.length; i++) {
      let alias = iterator[i].name;
      if (iterator[i].child) {
        alias = iterator[i].child!.name;
      }

      if (!alias) {
        alias = iterator[i].name;
      }

      const importType: ImportType = {
        name: iterator[i].name,
        path: importPath,
        fromPackage: importPath[0] !== '.',
        alias: alias
      };

      if (!tryFindImportType(importType.alias, context.imports)) {
        context.imports.push(importType);
      }
    }
  }
}