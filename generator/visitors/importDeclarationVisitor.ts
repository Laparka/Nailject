import { NodeVisitorBase } from './nodeVisitor';
import { ImportDeclaration, Node, SyntaxKind } from 'typescript';
import { CodeAccessor, GeneratorContext, ImportFrom } from '../generatorContext';
import * as path from 'path';

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

    let importPath = pathSpecifier.name;
    if (importPath.length !== 0 && importPath[0] === '.') {
      const moduleDir = path.parse(context.modulePath).dir;
      importPath = path.join(moduleDir, importPath).replace(/\\/g, '/');
      if (importPath.length !== 0 && importPath[0] !== '.') {
        importPath = './' + importPath;
      }
    }

    importClause.forEach(i => {
      i.path = importPath;
      context.imports.push(i);
    });
  }
}