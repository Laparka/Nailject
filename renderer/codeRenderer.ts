import { CodeWriter } from './codeWriter';
import { Liquid } from 'liquidjs';
import { getImportDeclarationFilter, getImportsFilter, getTypeNameFilter, getSymbolPath } from './templates/filters';
import { RegistrationDescriptor } from '../generator/generatorContext';

export interface CodeRenderer {
  renderResolver(templatePath: string, registration: RegistrationDescriptor): void;
}

export class LiquidCodeRenderer implements CodeRenderer {
  private readonly _codeWriter: CodeWriter;
  private readonly _liquid: Liquid;
  constructor(codeWriter: CodeWriter) {
    this._codeWriter = codeWriter;
    this._liquid = new Liquid();
    this._liquid.registerFilter('get_imports', getImportsFilter);
    this._liquid.registerFilter('write_import', getImportDeclarationFilter);
    this._liquid.registerFilter('get_type', getTypeNameFilter);
    this._liquid.registerFilter('get_symbol', getSymbolPath);
  }

  renderResolver(templatePath: string, registration: RegistrationDescriptor): void {
    const clonedRegistration = JSON.parse(JSON.stringify(registration));
    const content = this._liquid.renderFileSync(templatePath, {registration: clonedRegistration, outputDir: '__tests__/generated/'});
    this._codeWriter.write('', content);
  }
}