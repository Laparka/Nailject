import { createSourceFile, ScriptTarget, SourceFile, Node } from 'typescript';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { NodeVisitor } from './visitors/nodeVisitor';
import AnyNodeVisitor from './visitors/anyNodeVisitor';
import {
  CodeAccessor,
  GeneratorParameters,
  ImportFrom, InstanceDescriptor,
  RegistrationDescriptor,
} from './generatorContext';

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
      const instance = registration.instance;
      if (!instance || !instance.accessor.importFrom || instance.accessor.importFrom.raw.isExternal) {
        continue;
      }

      const filePath = `${instance.accessor.importFrom.normalized.path}.ts`;
      if (!existsSync(path.normalize(filePath))) {
        throw Error(`Package instances are not supported yet`);
      }

      const dependencies: RegistrationDescriptor[] = [];
      this._visitor.visit(RegistrationsParser.getSyntax(filePath, parameters.scriptTarget), {
        modulePath: filePath,
        instanceName: instance.accessor.importFrom.normalized.name,
        mode: 'Dependent',
        registrations: dependencies,
        imports: imports
      });

      if (dependencies.length === 0) {
        continue;
      }

      dependencies.forEach(ctorArg => RegistrationsParser.addInstanceDependencies(instance, ctorArg.service.accessor, registrations));
    }
  }

  private static addInstanceDependencies(instance: InstanceDescriptor, constructorArg: CodeAccessor, allRegistrations: RegistrationDescriptor[]) {
    const serviceRegistration = RegistrationsParser.tryFindRegistration(constructorArg, allRegistrations);
    if (!serviceRegistration) {
      const serviceProviderDescriptor = RegistrationsParser.isServiceProvider(constructorArg);
      if (serviceProviderDescriptor) {
        instance.constructorArgs.push({
          resolveType: constructorArg.name === '[]' ? 'Many' : 'One',
          symbolDescriptor: serviceProviderDescriptor
        })

        return;
      }

      throw Error(`The service type "${constructorArg.name}" was not found in container builder`);
    }

    const symbolDescriptor = serviceRegistration.service.symbolDescriptor;
    if (!symbolDescriptor) {
      throw Error(`Failed to read the service registration symbol`)
    }

    instance.constructorArgs.push({
      symbolDescriptor: symbolDescriptor,
      resolveType: constructorArg.name === '[]' && serviceRegistration.service.accessor.name !== constructorArg.name ? 'Many' : 'One'
    });
  }

  private static tryFindRegistration(constructorArg: CodeAccessor, allRegistrations: RegistrationDescriptor[]): RegistrationDescriptor | null {
    let nonGeneric: RegistrationDescriptor | null = null;
    for (const r of allRegistrations) {
      const isExactMatch = RegistrationsParser.areEqual(constructorArg, r.service.accessor, true);
      if (isExactMatch) {
        return r;
      }

      if (RegistrationsParser.areEqual(constructorArg, r.service.accessor, false)) {
        nonGeneric = r;
      }
    }

    return nonGeneric;
  }

  private static areEqual(ctor: CodeAccessor, registration: CodeAccessor, exact: boolean): boolean {
    if (registration.name === '[]') {
      // check the registration as T[]
      if (registration.child && ctor.name === '[]' && ctor.child) {
        return this.areEqual(ctor.child, registration.child, exact);
      }

      return false;
    }

    if (ctor.name === '[]') {
      return !!ctor.child && this.areEqual(ctor.child, registration, exact);
    }

    if (registration.importFrom) {
      // register<L.Logger<T>> --> ConsoleMonitor(logger: Logger<T>)
      // register<Logger<T>> --> ConsoleMonitor(logger: L.Logger<T>)
      // register<L.Logger<T>> --> ConsoleMonitor(logger: L.Logger<T>)
      // The aliased-accessor always has a normalized import,
      // so we don't need to check the children here
      const normalizedReg = registration.importFrom.normalized;
      const normalizedCtor = ctor.importFrom?.normalized;
      if (!normalizedCtor || normalizedCtor.kind !== normalizedReg.kind || normalizedCtor.name !== normalizedReg.name || normalizedCtor.path !== normalizedReg.path) {
        return false;
      }
    }
    else {
      // register<Map<string, T>> --> ConsoleMonitor(users: Map<string, T>)
      // Built-in types don't have the import declarations
      if (ctor.importFrom || registration.name !== ctor.name) {
        return false;
      }
    }

    if (registration.typeNames && registration.typeNames.length !== 0) {
      if (!ctor.typeNames || ctor.typeNames.length !== registration.typeNames.length) {
        return false;
      }

      if (exact) {
        // TODO: Add exact match and similar-match return.
        //  Give priority to exact match registration and, if not found, resolve type-argument-less service
        for (let i = 0; i < registration.typeNames.length; i++) {
          if (!this.areEqual(registration.typeNames[i], ctor.typeNames[i], exact)) {
            return false;
          }
        }
      }
    }
    else if (ctor.typeNames && ctor.typeNames.length !== 0) {
      return false;
    }

    return true;
  }

  private static getSyntax(filePath: string, scriptTarget: ScriptTarget): Node {
    if (!existsSync(path.normalize(filePath))) {
      throw Error(`File ${filePath} was not found`);
    }

    const fileContent = readFileSync(filePath, { encoding: "utf8" });
    const file: SourceFile = createSourceFile("inline-content.ts", fileContent.toString(), scriptTarget);
    return file.getChildAt(0);
  }

  private static isServiceProvider(pathAccessor: CodeAccessor): CodeAccessor | null {
    if (!pathAccessor) {
      return null;
    }

    if (pathAccessor.name === '[]') {
      if (pathAccessor.child) {
        return RegistrationsParser.isServiceProvider(pathAccessor.child);
      }

      return null;
    }

    if (!pathAccessor.importFrom) {
      return null;
    }

    if (pathAccessor.importFrom.normalized.path !== 'pileuple-api/serviceProvider') {
      return null;
    }

    if (pathAccessor.importFrom.normalized.name !== 'ServiceProvider') {
      return null;
    }

    const importDefinition: ImportFrom = {
      name: 'ServiceProviderSymbol',
      path: pathAccessor.importFrom.normalized.path,
      isExternal: pathAccessor.importFrom.normalized.isExternal,
      alias: 'ServiceProviderSymbol',
      kind: 'Named'
    }
    return {
      importFrom: {
        normalized: importDefinition,
        raw: importDefinition
      },
      name: importDefinition.name
    }
  }
}