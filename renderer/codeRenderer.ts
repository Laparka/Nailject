import { CodeWriter } from './codeWriter';
import { Liquid } from 'liquidjs';
import { RegistrationDescriptor } from '../generator/generatorContext';
import { getImports, readAccessor, writeImport } from './templateFilters';
import path from 'path';

export interface CodeRenderer {
  renderResolver(registration: RegistrationDescriptor, outputDir: string): void;
}

const templateDir = 'renderer/templates';
const resolverTemplatePath = path.join(templateDir, 'resolver.liquid');

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

  renderResolver(registration: RegistrationDescriptor, outputDir: string): void {
    if (!registration) {
      throw Error(`The registration argument is missing`);
    }

    if (!outputDir) {
      throw Error(`The output directory argument is missing`);
    }

    const clonedRegistration = JSON.parse(JSON.stringify(registration));
        const content = this._liquid.renderFileSync(resolverTemplatePath, { registration: clonedRegistration, outputDir: outputDir });
    this._codeWriter.write('', content);
  }
}