import { CodeWriter } from './codeWriter';
import { Liquid } from 'liquidjs';
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
  }

  renderResolver(templatePath: string, registration: RegistrationDescriptor): void {
    const clonedRegistration = JSON.parse(JSON.stringify(registration));
    const content = this._liquid.renderFileSync(templatePath, {registration: clonedRegistration, outputDir: '__tests__/generated/'});
    this._codeWriter.write('', content);
  }
}