import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import { InstanceTypeDeclaration, ServiceResolverDeclaration } from './generatorContext';

export default class RegistrationsParser {
  private readonly _visitor: NodeVisitor;

  constructor() {
    this._visitor = new AnyNodeVisitor();
  }

  parse(registrationFilePath: string, className: string): ServiceResolverDeclaration[] {
    if (!existsSync(path.normalize(registrationFilePath))) {
      throw Error(`File ${registrationFilePath} was not found`);
    }

    const fileContent = readFileSync(registrationFilePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), ScriptTarget.ES2017);
    const syntax = file.getChildAt(0);

    const resolvers: ServiceResolverDeclaration[] = [];
    this._visitor.visit(syntax, {
      modulePath: registrationFilePath,
      instanceName: className,
      mode: 'Module',
      resolvers: resolvers,
      imports: [],
      generator: this
    });

    return resolvers;
  }

  parseDependencies(instanceTypeNode: InstanceTypeDeclaration): InstanceTypeDeclaration[] {
    const filePath = `${instanceTypeNode.path.path}.ts`;
    if (!existsSync(path.normalize(filePath))) {
      throw Error(`File ${filePath} was not found`);
    }

    const fileContent = readFileSync(filePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), ScriptTarget.ES2017);
    const syntax = file.getChildAt(0);

    const resolvers: ServiceResolverDeclaration[] = [];
    this._visitor.visit(syntax, {
      modulePath: filePath,
      instanceName: instanceTypeNode.type.name,
      mode: 'Dependent',
      resolvers: resolvers,
      imports: [],
      generator: this
    });

    const argNodes: InstanceTypeDeclaration[] = [];
    resolvers.forEach(node => argNodes.push(node.instanceTypeNode));
    return argNodes;
  }
}