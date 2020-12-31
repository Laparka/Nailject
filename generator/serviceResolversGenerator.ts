import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import { LifetimeScope } from '../api/containerBuilder';
import {  GeneratorContext, InstanceTypeDependencies,  ServiceResolverDeclaration} from './generatorContext';
import { tryFindImportType } from './utils';

export default class ServiceResolversGenerator {
  private readonly _visitor: NodeVisitor;

  constructor() {
    this._visitor = new AnyNodeVisitor();
  }

  generate(registrationFilePath: string, className: string): ServiceResolverDeclaration[] {
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

  getDependencies(importPath: string, className: string): InstanceTypeDependencies {
    const instanceFilePath = `${importPath}.ts`;
    if (!existsSync(path.normalize(instanceFilePath))) {
      throw Error(`File ${instanceFilePath} was not found`);
    }

    const fileContent = readFileSync(instanceFilePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), ScriptTarget.ES2015);
    const syntax = file.getChildAt(0);

    const ctx: GeneratorContext = {
      modulePath: instanceFilePath,
      instanceName: className,
      mode: 'Dependent',
      resolvers: new Map<LifetimeScope, ServiceResolverDeclaration[]>(),
      imports: [],
      generator: this
    };

    this._visitor.visit(syntax, ctx);
    const result: InstanceTypeDependencies = {
      constructorArgs: [],
      imports: []
    };

    const resolversIterator = ctx.resolvers.keys();
    let next = resolversIterator.next();
    while (next && !next.done) {
      const registrations = ctx.resolvers.get(next.value)!;
      for (let i = 0; i < registrations.length; i++) {
        result.constructorArgs.push(registrations[i].serviceTypeNode);
        for (let j = 0; j < registrations[i].imports.length; j++) {
          if (!tryFindImportType(registrations[i].imports[j].alias, result.imports)) {
            result.imports.push(registrations[i].imports[j]);
          }
        }
      }
      next = resolversIterator.next();
    }

    return result;
  }
}