import { createSourceFile, ScriptTarget, SourceFile, Node } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import {
  GeneratorParameters,
  ImportFrom,
  RegistrationDescriptor,
} from './generatorContext';
import { getAccessorImport, tokenizePropertyAccessor } from './utils';

export default class RegistrationsParser {
  private readonly _visitor: NodeVisitor;

  constructor() {
    this._visitor = new AnyNodeVisitor();
  }

  parse(parameters: GeneratorParameters): RegistrationDescriptor[] {
    if (!parameters || !parameters.registrationFilePath) {
      throw Error(`Registration File Path parameter is missing`);
    }

    if (!parameters.registrationClassName) {
      throw Error(`Registration class name is missing`);
    }

    if (!parameters.outputDirectory) {
      throw Error(`Output directory path parameter is missing`);
    }

    const registrations: RegistrationDescriptor[] = [];
    const imports: ImportFrom[] = [];
    this._visitor.visit(RegistrationsParser.getSyntax(parameters.registrationFilePath, parameters.scriptTarget), {
      modulePath: parameters.registrationFilePath,
      instanceName: parameters.registrationClassName,
      mode: 'Module',
      registrations: registrations,
      imports: imports
    });

    this.fillDependencies(parameters, registrations, imports);
    return registrations;
  }

  private fillDependencies(parameters: GeneratorParameters, registrations: RegistrationDescriptor[], imports: ImportFrom[]): void {
    for(const registration of registrations) {
      if (!registration.instance || !registration.instance.accessor.importDeclaration) {
        continue;
      }

      const filePath = `${registration.instance.accessor.importDeclaration.from.path}.ts`;
      if (!existsSync(path.normalize(filePath))) {
        throw Error(`Package instances are not supported yet`);
      }

      const dependencies: RegistrationDescriptor[] = [];
      const instanceTypeNameTokens = tokenizePropertyAccessor(registration.instance.accessor);
      this._visitor.visit(RegistrationsParser.getSyntax(filePath, parameters.scriptTarget), {
        modulePath: filePath,
        instanceName: instanceTypeNameTokens[instanceTypeNameTokens.length - 1],
        mode: 'Dependent',
        registrations: dependencies,
        imports: imports
      });

      if (dependencies.length === 0) {
        continue;
      }

      dependencies.forEach(ctorArg => RegistrationsParser.assignArgumentSymbol(registration, ctorArg, registrations));
    }
  }

  private static assignArgumentSymbol(registration: RegistrationDescriptor,
                                      constructorArg: RegistrationDescriptor,
                                      allRegistrations: RegistrationDescriptor[]) {
    if (!registration.instance) {
      throw Error(`Failed to parse the registration instance`);
    }

    const serviceImport = getAccessorImport(constructorArg.service.accessor);
    const serviceRegistrationIndex = allRegistrations.findIndex(r => {
      const accessor = r.service.accessor;
      if (accessor && accessor.importDeclaration) {
        return accessor.importDeclaration.normalized.path === serviceImport.normalized.path
          && accessor.importDeclaration.normalized.name === serviceImport.normalized.name;
      }

      return false;
    });

    if (serviceRegistrationIndex === -1) {
      throw Error(`The constructor argument ${constructorArg.service.accessor.name} type registration was not found`);
    }

    const serviceRegistration = allRegistrations[serviceRegistrationIndex];
    if (!serviceRegistration.service.symbolDescriptor) {
      throw Error(`The ${serviceRegistration.service.accessor.name} service has registration symbol missing`);
    }

    registration.instance.constructorArgs.push(serviceRegistration.service.symbolDescriptor)
  }

  private static getSyntax(filePath: string, scriptTarget: ScriptTarget): Node {
    if (!existsSync(path.normalize(filePath))) {
      throw Error(`File ${filePath} was not found`);
    }

    const fileContent = readFileSync(filePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), scriptTarget);
    return file.getChildAt(0);
  }
}