import ExpressionVisitorBase from './expressionVisitorBase';
import Expression from '../../interfaces/expression';
import { GeneratorContext, GeneratorMode, ImportType } from '../../interfaces/generatorContext';
import { BaseNode, SourceLocation, Range } from '@typescript-eslint/types/dist/ts-estree';
import { existsSync, readFileSync } from 'fs';
import { parseAndGenerateServices } from '@typescript-eslint/typescript-estree';
import * as path from 'path';

export class FilePathNode implements BaseNode {
  loc: SourceLocation;
  range: Range;
  type: string;
  filePath: string;
  mode: GeneratorMode;
  constructor(filePath: string, mode: GeneratorMode) {
    this.loc = { start: { column: 0, line: 0 }, end: { column: 0, line: 0 } };
    this.range = [0, 0]
    this.type = "File";
    this.filePath = filePath;
    this.mode = mode;
  }
};

export class FilePathDeclarationVisitor extends ExpressionVisitorBase<FilePathNode> {
  canVisit(expression: Expression): boolean {
    return expression.type === "File";
  }

  visitExpression(expression: FilePathNode, context: GeneratorContext): string[] {
    let filePath = expression.filePath;
    if (!existsSync(filePath)) {
      if (path.extname(filePath).length === 0) {
        filePath = filePath + ".ts";
      }
    }

    if (!existsSync(filePath)) {
      throw Error(`File was not found at the given path ${filePath}`);
    }

    const content = readFileSync(filePath, { encoding: 'utf8' });
    const ast = parseAndGenerateServices(content, {
      comment: false,
      createDefaultProgram: false,
      debugLevel: false,
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      errorOnUnknownASTType: true,
      jsx: false,
      loc: false,
      range: false,
      tokens: false,
      preserveNodeMaps: false,
      useJSXTextNode: false,
      EXPERIMENTAL_useSourceOfProjectReferenceRedirect: false,
      loggerFn: message => console.log(`AST Parser: ${message}`)
    });

    context.modulePath = filePath;
    context.mode = expression.mode;
    return this.rootVisitor.visit(ast.ast, context);
  }
}