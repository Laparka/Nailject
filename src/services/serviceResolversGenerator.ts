import * as path from 'path';
import Expression from '../interfaces/expression';
import { DependencyDescriptor, GeneratorContext, ImportType } from '../interfaces/generatorContext';
import ExpressionVisitor from '../interfaces/expressionVisitor';
import ProgramVisitor from './visitors/programVisitor';
import ImportDeclarationVisitor from './visitors/importDeclarationVisitor';
import ExportNamedDeclarationVisitor from './visitors/exportNamedDeclarationVisitor';
import ClassDeclarationVisitor from './visitors/classDeclarationVisitor';
import MethodDefinitionVisitor from './visitors/methodDefinitionVisitor';
import FunctionExpressionVisitor from './visitors/functionExpressionVisitor';
import QualifiedNameVisitor from './visitors/qualifiedNameVisitor';
import ExpressionStatementVisitor from './visitors/expressionStatementVisitor';
import CallExpressionVisitor from './visitors/callExpressionVisitor';
import TypeReferenceVisitor from './visitors/typeReferenceVisitor';
import PrimitiveTypeVisitor from './visitors/primitiveTypeVisitor';
import MemberExpressionVisitor from './visitors/memberExpressionVisitor';
import { FilePathNode, FilePathDeclarationVisitor } from './visitors/filePathDeclarationVisitor';
import ExportDefaultDeclarationVisitor from './visitors/exportDefaultDeclarationVisitor';
import ArrayTypeVisitor from './visitors/arrayTypeVisitor';
import ConstructorVisitor from './visitors/constructorVisitor';
import { LifetimeScope } from '../interfaces/lifetimeScope';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const DEFAULT_IMPORTS: string[] = [
  "import ServiceProvider from 'nailject/interfaces/serviceProvider';",
  "import { serviceConstructor } from 'nailject/interfaces/serviceResolver';"
];

export default class ServiceResolversGenerator implements ExpressionVisitor {
  private readonly _visitors: ExpressionVisitor[];

  constructor() {
    this._visitors = [
      new ProgramVisitor(this),
      new ImportDeclarationVisitor(this),
      new ExportNamedDeclarationVisitor(this),
      new ClassDeclarationVisitor(this),
      new MethodDefinitionVisitor(this),
      new FunctionExpressionVisitor(this),
      new QualifiedNameVisitor(),
      new QualifiedNameVisitor(),
      new ExpressionStatementVisitor(this),
      new CallExpressionVisitor(this),
      new TypeReferenceVisitor(this),
      new MemberExpressionVisitor(this),
      new PrimitiveTypeVisitor(),
      new FilePathDeclarationVisitor(this),
      new ExportDefaultDeclarationVisitor(this),
      new ArrayTypeVisitor(this),
      new ConstructorVisitor(this)
    ];
  }

  visit(expression: Expression, context: GeneratorContext): string[] {
    for(let i = 0; i < this._visitors.length; i++) {
      if (this._visitors[i].canVisit(expression)) {
        return this._visitors[i].visit(expression, context);
      }
    }

    return [];
  }

  generateServiceResolvers(modulePath: string, outputPath: string): string[] {
    if (!modulePath || !outputPath) {
      throw Error("Module and output path are required");
    }

    modulePath = path.normalize(modulePath);
    if (outputPath[outputPath.length - 1] !== '/') {
      outputPath = outputPath + '/';
    }

    const outputDir = path.normalize(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir);
    }
    const fileNode = new FilePathNode(modulePath, 'Aggregating');
    const context: GeneratorContext = {
      import: new Map<string, ImportType[]>(),
      instanceName: "",
      mode: fileNode.mode,
      modulePath: fileNode.filePath,
      usedImports: new Map<string, ImportType[]>(),
      registrations: new Map<LifetimeScope, DependencyDescriptor[]>()
    };

    this.visit(fileNode, context);
    if (!context.registrations ||context.registrations.size === 0) {
      return [];
    }

    const keysIterator = context.registrations.keys();
    let next = keysIterator.next();
    while(next && !next.done) {
      const scope: LifetimeScope = next.value;
      const registrations = context.registrations.get(scope)!;
      for(let i = 0; i < registrations.length; i++) {
        const registrationCtx = registrations[i];
        const outputFileContent = this.generateServiceLocatorCode(outputDir, registrationCtx, scope);
        let outputFileName = this.generateServiceLocatorName(registrationCtx.instanceType, registrationCtx.serviceType, scope);
        outputFileName = outputFileName[0].toLowerCase() + outputFileName.slice(1, outputFileName.length) + ".generated.ts"
        const outputFilePath = path.join(outputDir, outputFileName);
        writeFileSync(outputFilePath, outputFileContent, {encoding: "utf8"});
      }

      next = keysIterator.next();
    }

    return [];
  }

  canVisit(expression: Expression): boolean {
    return true;
  }

  private generateServiceLocatorName(instanceType: string[], serviceType: string[], scope: LifetimeScope): string {
    const instanceTypeName = instanceType.join('Of').split('.').join('Of');
    const serviceTypeName = serviceType.join('Of').split('.').join('Of');
    return `${instanceTypeName}Of${serviceTypeName}${scope}ServiceLocator`;
  }

  private generateServiceLocatorCode(outputDir: string, dependencyDescriptor: DependencyDescriptor, scope: LifetimeScope): string {
    const importKeysIterator = dependencyDescriptor.imports.keys();
    let importKey = importKeysIterator.next();
    const importLines: string[] = [];
    switch (scope) {
      case 'Singleton': {
        importLines.push('import SingletonServiceResolver from \'nailject/services/singletonServiceResolver\';')
        break;
      }

      case 'Transient': {
        importLines.push('import TransientServiceResolver from \'nailject/services/transientServiceResolver\';')
        break;
      }
    }

    while(importKey && !importKey.done) {
      const importPath = importKey.value;
      const importDescriptors = dependencyDescriptor.imports.get(importPath)!;
      const relativePath = path.relative(outputDir, importPath).replace(/\\/g, '/');
      for(let i = 0; i < importDescriptors.length; i++) {
        const importDesc = importDescriptors[i];
        switch (importDesc.kind) {
          case "Named": {
            importLines.push(`import {${importDesc.name} as ${importDesc.alias}} from "${relativePath}"`);
            break;
          }

          case "Namespace": {
            importLines.push(`import * as ${importDesc.alias} from "${relativePath}"`);
            break;
          }

          case "Default": {
            importLines.push(`import ${importDesc.name} from "${relativePath}"`);
            break;
          }
        }
      }

      importKey = importKeysIterator.next();
    }

    const locatorClassLine = `export default class ${this.generateServiceLocatorName(dependencyDescriptor.instanceType, dependencyDescriptor.serviceType, scope)} extends ${scope}ServiceResolver<${dependencyDescriptor.instanceType.join('.')}> {`;
    const returnTypeLine = dependencyDescriptor.instanceType.length === 1 ? dependencyDescriptor.instanceType[0] : `${dependencyDescriptor.instanceType[0]}<${dependencyDescriptor.instanceType[1]}>`;
    const resolveMethodLine = `  doResolve(serviceProvider: ServiceProvider): ${returnTypeLine} {`

    const argLines: string[] = [];
    const argIds: string[] = [];
    for(let i = 0; i < dependencyDescriptor.dependencies.length; i++) {
      const ctorArg = dependencyDescriptor.dependencies[i];
      argIds.push(`service${i+1}`);
      let resolveArgLine = `    const ${argIds[i]} = `;
      if (ctorArg.endsWith('[]')) {
        resolveArgLine += `serviceProvider.resolveMany<${ctorArg}>();`
      }
      else {
        resolveArgLine += `serviceProvider.resolveOne<${ctorArg}>();`
      }

      argLines.push(resolveArgLine);
    }

    const ctorTypeLine = `    const ctor: serviceConstructor<${returnTypeLine}> = ${returnTypeLine};`
    const returnStatementLine = `    return new ctor(${argIds.join(', ')});`
    const endMethodLine = '  }';
    const endClassLine = '}'
    return [...DEFAULT_IMPORTS, ...importLines, '', locatorClassLine, resolveMethodLine, ...argLines, ctorTypeLine, returnStatementLine, endMethodLine, endClassLine].join('\r\n');
  }
}