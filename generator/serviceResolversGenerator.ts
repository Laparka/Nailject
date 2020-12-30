import { createSourceFile, ScriptTarget, SourceFile, SyntaxKind } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import { LifetimeScope } from '../api/containerBuilder';
import { ServiceResolverDeclaration } from './generatorContext';

export default class ServiceResolversGenerator {
  private readonly _visitor: NodeVisitor;
  constructor() {
    this._visitor = new AnyNodeVisitor();
  }

  generate(registrationFilePath: string, className: string): Map<string, string[]> {
    if (!existsSync(path.normalize(registrationFilePath))) {
      throw Error(`File ${registrationFilePath} was not found`);
    }

    const fileContent = readFileSync(registrationFilePath, {encoding: "utf8"});
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), ScriptTarget.ES2015);
    const syntax = file.getChildAt(0);

    const generatedFiles = this._visitor.visit(syntax, {
      modulePath: registrationFilePath,
      instanceName: className,
      mode: 'Module',
      resolvers: new Map<LifetimeScope, ServiceResolverDeclaration[]>(),
      imports: [],
    });

    if (generatedFiles) {
      return generatedFiles;
    }

    return new Map<string, string[]>()
  }
}