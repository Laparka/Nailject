import { Node } from 'typescript';
import { NodeVisitor } from './nodeVisitor';
import { GeneratorContext } from '../generatorContext';
import SyntaxListVisitor from './syntaxListVisitor';
import ImportDeclarationVisitor from './importDeclarationVisitor';
import ImportClauseVisitor from './importClauseVisitor';
import StringLiteralVisitor from './stringLiteralVisitor';
import NamespaceImportVisitor from './namespaceImportVisitor';
import IdentifierVisitor from './identifierVisitor';
import NamedImportVisitor from './namedImportVisitor';
import ImportSpecifierVisitor from './importSpecifierVisitor';
import ClassDeclarationVisitor from './classDeclarationVisitor';
import HeritageClauseVisitor from './heritageClauseVisitor';
import TypeArgumentVisitor from './typeArgumentVisitor';
import TypeReferenceVisitor from './typeReferenceVisitor';
import PropertyAccessExpressionVisitor from './propertyAccessExpressionVisitor';
import MethodDeclarationVisitor from './methodDeclarationVisitor';
import ParameterVisitor from './parameterVisitor';
import ExpressionStatementVisitor from './expressionStatementVisitor';
import CallExpressionVisitor from './callExpressionVisitor';
import QualifiedNameVisitor from './qualifiedNameVisitor';
import ConstructorVisitor from './constructorVisitor';
import PrimitiveTypeVisitor from './primitiveTypeVisitor';
import ArrayTypeVisitor from './arrayTypeVisitor';

export default class AnyNodeVisitor implements NodeVisitor {
  private readonly _visitors: NodeVisitor[];
  constructor() {
    this._visitors = [
      new SyntaxListVisitor(this),
      new ImportDeclarationVisitor(this),
      new ImportClauseVisitor(this),
      new StringLiteralVisitor(this),
      new NamespaceImportVisitor(this),
      new IdentifierVisitor(this),
      new NamedImportVisitor(this),
      new ImportSpecifierVisitor(this),
      new ClassDeclarationVisitor(this),
      new HeritageClauseVisitor(this),
      new TypeArgumentVisitor(this),
      new TypeReferenceVisitor(this),
      new PropertyAccessExpressionVisitor(this),
      new MethodDeclarationVisitor(this),
      new ParameterVisitor(this),
      new ExpressionStatementVisitor(this),
      new CallExpressionVisitor(this),
      new QualifiedNameVisitor(this),
      new ConstructorVisitor(this),
      new PrimitiveTypeVisitor(),
      new ArrayTypeVisitor(this)
    ];
  }
  canVisit(node: Node): boolean {
    return true;
  }

  visit(node: Node, context: GeneratorContext): any | void {
    for(let i = 0; i < this._visitors.length; i++) {
      if (this._visitors[i].canVisit(node)) {
        return this._visitors[i].visit(node, context);
      }
    }
  }
}