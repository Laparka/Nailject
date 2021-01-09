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
import { isSameType, tokenizePropertyAccessor } from './utils';
import { getTypeName } from '../renderer/templates/filters';

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

    const serviceRegistrationIndex = allRegistrations.findIndex(r => isSameType(constructorArg.service.accessor, r.service.accessor));

    if (serviceRegistrationIndex === -1) {
      throw Error(`The registration type ${getTypeName(constructorArg.service.accessor, true)} was not found`);
    }

    const serviceRegistration = allRegistrations[serviceRegistrationIndex];
    if (!serviceRegistration.service.symbolDescriptor) {
      throw Error(`The ${serviceRegistration.service.accessor.name} service has registration symbol missing`);
    }

    registration.instance.constructorArgs.push({
      symbolDescriptor: serviceRegistration.service.symbolDescriptor,
      isArray: constructorArg.service.accessor.name === '[]'
    })
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