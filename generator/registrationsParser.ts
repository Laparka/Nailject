import { createSourceFile, ScriptTarget, SourceFile, Node } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import { ConstructorArgumentDescriptor, RegistrationDescriptor } from './generatorContext';
import { getLastPropertyAccessor } from './utils';

export default class RegistrationsParser {
  private readonly _visitor: NodeVisitor;

  constructor() {
    this._visitor = new AnyNodeVisitor();
  }

  parse(registrationFilePath: string, className: string): RegistrationDescriptor[] {
    const registrations: RegistrationDescriptor[] = [];
    this._visitor.visit(RegistrationsParser.getSyntax(registrationFilePath), {
      modulePath: registrationFilePath,
      instanceName: className,
      mode: 'Module',
      registrations: registrations,
      imports: []
    });

    this.fillDependencies(path.parse(registrationFilePath).dir, registrations);
    return registrations;
  }

  private fillDependencies(moduleDir: string, registrations: RegistrationDescriptor[]): void {
    for(const registration of registrations) {
      if (!registration.instance || !registration.instance.importFrom) {
        continue;
      }

      const filePath = `${path.join(moduleDir, registration.instance.importFrom.path)}.ts`;
      if (!existsSync(path.normalize(filePath))) {
        continue;
      }

      const dependencies: RegistrationDescriptor[] = [];
      this._visitor.visit(RegistrationsParser.getSyntax(filePath), {
        modulePath: filePath,
        instanceName: getLastPropertyAccessor(registration.instance.accessor),
        mode: 'Dependent',
        registrations: dependencies,
        imports: []
      });

      if (dependencies.length === 0) {
        continue;
      }

      dependencies.forEach(ctorArg => {
        const ctorArgDescriptor: ConstructorArgumentDescriptor = {
          isCollection: ctorArg.service.accessor.name === '[]',
          symbolPath: ctorArg.service.symbolDescriptor.symbolId
        };

        if (ctorArg.service.symbolDescriptor.symbolNamespace && ctorArg.service.symbolDescriptor.symbolNamespace.length !== 0) {
          ctorArgDescriptor.symbolPath = `${ctorArg.service.symbolDescriptor.symbolNamespace}.${ctorArgDescriptor.symbolPath}`;
        }

        registration.instance!.constructorArgs.push(ctorArgDescriptor);
      });
    }
  }

  private static getSyntax(filePath: string): Node {
    if (!existsSync(path.normalize(filePath))) {
      throw Error(`File ${filePath} was not found`);
    }

    const fileContent = readFileSync(filePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), ScriptTarget.ES2017);
    return file.getChildAt(0);
  }
}