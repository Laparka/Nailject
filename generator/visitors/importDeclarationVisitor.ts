import { NodeVisitorBase } from './nodeVisitor';
import { ImportDeclaration, Node, SyntaxKind } from 'typescript';
import { CodeAccessor, GeneratorContext, ImportFrom } from '../generatorContext';
import * as path from 'path';
import { existsSync } from 'fs';

export default class ImportDeclarationVisitor extends NodeVisitorBase<ImportDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ImportDeclaration;
  }

  doVisit(node: ImportDeclaration, context: GeneratorContext): void {
    if (!node.importClause) {
      return
    }

    const importClause = this.visitNext(node.importClause, context) as ImportFrom[];
    if (!importClause) {
      throw Error("The ImportDeclaration has ImportClause missing");
    }

    const pathSpecifier = this.visitNext(node.moduleSpecifier, context) as CodeAccessor;
    if (!pathSpecifier || !pathSpecifier.name) {
      throw Error("ImportDeclaration From-path must be the only one in the list");
    }

    const moduleDir = path.parse(context.modulePath).dir;
    const importPath = `${path.join(moduleDir, pathSpecifier.name)}.ts`;
    const isExternal = pathSpecifier.name[0] !== '.' && pathSpecifier.name[0] !== '/'
      || !existsSync(importPath);
    importClause.forEach(i => {
      i.isExternal = isExternal,
      i.path = pathSpecifier.name;
      context.imports.push(i);
    });
  }
}