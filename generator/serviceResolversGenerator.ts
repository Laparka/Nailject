import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import { LifetimeScope } from '../api/containerBuilder';
import {  ServiceResolverDeclaration} from './generatorContext';

export default class ServiceResolversGenerator {
  private readonly _visitor: NodeVisitor;

  constructor() {
    this._visitor = new AnyNodeVisitor();
  }

  parse(registrationFilePath: string, className: string): ServiceResolverDeclaration[] {
    if (!existsSync(path.normalize(registrationFilePath))) {
      throw Error(`File ${registrationFilePath} was not found`);
    }

    const fileContent = readFileSync(registrationFilePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), ScriptTarget.ES2015);
    const syntax = file.getChildAt(0);

    const resolvers = new Map<LifetimeScope, ServiceResolverDeclaration[]>()
    this._visitor.visit(syntax, {
      modulePath: registrationFilePath,
      instanceName: className,
      mode: 'Module',
      resolvers: resolvers,
      imports: [],
      generator: this
    });

    const result: ServiceResolverDeclaration[] = [];
    const scopesIterator = resolvers.keys();
    let next = scopesIterator.next();
    while (next && !next.done) {
      result.push(...resolvers.get(next.value)!);
      next = scopesIterator.next();
    }

    return result;
  }
}