import { CodeWriter } from './codeWriter';
import { RegistrationDescriptor } from '../generator/generatorContext';

export class ResolversRenderer {
  private readonly _codeWriter: CodeWriter;
  constructor(codeWriter: CodeWriter) {
    this._codeWriter = codeWriter;
  }

  render(registrations: RegistrationDescriptor[]) {
    if (!registrations) {
      throw Error(`The registrations parameter is missing`)
    }

    for(const r of registrations) {
      this.renderResolver(r);
    }
    console.log(this._codeWriter);
  }

  private renderResolver(registration: RegistrationDescriptor) {
    if (!registration) {
      throw Error(`The registration parameter is missing`);
    }
  }
}