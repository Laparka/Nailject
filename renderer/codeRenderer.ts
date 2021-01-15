import { CodeWriter } from './codeWriter';
import { Liquid } from 'liquidjs';
import { CodeAccessor, RegistrationDescriptor } from '../generator/generatorContext';
import { getImports, readAccessor, writeImport } from './templateFilters';
import path from 'path';

export interface CodeRenderer {
  renderResolver(registration: RegistrationDescriptor, outputDir: string): string;
  renderServiceProvider(resolvers: string[], outputDirectory: string): string;
}

const resolverTemplatePath = path.join(__dirname, 'templates', 'resolver.liquid');
const serviceProviderTemplatePath = path.join(__dirname, 'templates', 'serviceProvider.liquid');

export class LiquidCodeRenderer implements CodeRenderer {
  private readonly _codeWriter: CodeWriter;
  private readonly _liquid: Liquid;
  constructor(codeWriter: CodeWriter) {
    this._codeWriter = codeWriter;
    this._liquid = new Liquid();
    this._liquid.registerFilter('read_accessor', readAccessor);
    this._liquid.registerFilter('get_imports', getImports);
    this._liquid.registerFilter('write_import', writeImport);
  }

  renderResolver(registration: RegistrationDescriptor, outputDir: string): string {
    if (!registration) {
      throw Error(`The registration argument is missing`);
    }

    if (!outputDir) {
      throw Error(`The output directory argument is missing`);
    }

    const fileImportName = `generated.${LiquidCodeRenderer.getRegistrationName(registration)}`;
    const outputFilePath = path.join(outputDir, `${fileImportName}.ts`);
    const clonedRegistration = JSON.parse(JSON.stringify(registration));
    const content = this._liquid.renderFileSync(resolverTemplatePath, { registration: clonedRegistration, outputDir: outputDir });
    this._codeWriter.write(outputFilePath, content);
    return fileImportName;
  }

  renderServiceProvider(resolvers: string[], outputDirectory: string): string {
    if (!resolvers) {
      throw Error(`The service resolver files path argument is missing`);
    }

    if (!outputDirectory) {
      throw Error(`The output directory argument is missing`);
    }

    const outputFilePath = path.join(outputDirectory, `generated.serviceProvider.ts`);
    const content = this._liquid.renderFileSync(serviceProviderTemplatePath, { resolvers: resolvers });
    this._codeWriter.write(outputFilePath, content);
    return outputFilePath;
  }

  private static getRegistrationName(registration: RegistrationDescriptor): string {
    const tokens: string[] = [];
    if (registration.service && registration.service.accessor) {
      tokens.push(LiquidCodeRenderer.getAccessorName(registration.service.accessor));
    }

    if (registration.instance && registration.instance.accessor) {
      tokens.push(LiquidCodeRenderer.getAccessorName(registration.instance.accessor));
    }

    return tokens.join('Of');
  }

  private static getAccessorName(accessor: CodeAccessor): string {
    const tokens: string[] = [];
    if (accessor.name === '[]') {
      tokens.push('Array');
      if (accessor.child) {
        accessor = accessor.child;
      }
    }

    if (accessor.importFrom) {
      tokens.push(accessor.importFrom.normalized.name);
    }
    else {
      tokens.push(accessor.name);
    }

    if (accessor.child) {
      tokens.push(LiquidCodeRenderer.getAccessorName(accessor.child));
    }
    else if (accessor.typeNames && accessor.typeNames.length !== 0) {
      tokens.push(...accessor.typeNames.map(t => LiquidCodeRenderer.getAccessorName(t)));
    }

    return tokens.join('Of');
  }
}