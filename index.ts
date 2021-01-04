import RegistrationsParser from './generator/registrationsParser';
import { ImportFrom, RegistrationSymbol } from './generator/generatorContext';
import { Liquid } from 'liquidjs'
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const parser = new RegistrationsParser();
async function generate(sourceFilePath: string, registrationClassName: string, outputDirectory: string): Promise<string[]> {
  const generatedFiles: string[] = [];
  const registrations = parser.parse(sourceFilePath, registrationClassName);
  const allSymbols: RegistrationSymbol[] = [];
  const namespaces: string[] = [];
  const typeImport: ImportFrom = {
    name: '*',
    alias: '__SERVICE_TYPE_SYMBOLS',
    kind: 'Namespace',
    path: path.join(outputDirectory, 'types.generated').replace(/[\\]/g, '/')
  };

  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, {recursive: true});
  }

  const liquid = new Liquid();
  for (const r of registrations) {
    if (r.instance.constructorArgs.length !== 0) {
      r.imports.push(typeImport);
    }

    const serviceResolverCode = await liquid.renderFile('generator/templates/transientResolver.liquid', r);
    let serviceResolverFileName = `${r.scope}Of${r.instance.displayName}Of${r.service.displayName}ServiceResolver.ts`;
    serviceResolverFileName = serviceResolverFileName[0].toLowerCase() + serviceResolverFileName.substring(1, serviceResolverFileName.length );
    const serviceResolverPath = path.join(outputDirectory, serviceResolverFileName);
    writeFileSync(serviceResolverPath, serviceResolverCode, {encoding: 'utf8'});
    const symbolDescriptor = r.service.symbolDescriptor;
    if (allSymbols.findIndex(s => s.symbolId === symbolDescriptor.symbolId && s.symbolNamespace == symbolDescriptor.symbolNamespace) === -1) {
      allSymbols.push(symbolDescriptor);
    }

    if (namespaces.findIndex(n => n === symbolDescriptor.symbolNamespace) === -1) {
      namespaces.push(symbolDescriptor.symbolNamespace);
    }
  }

  const symbolTypesCode = await liquid.renderFile('generator/templates/symbolTypes.liquid', {namespaces: namespaces, symbols: allSymbols});
  writeFileSync(path.join(outputDirectory, 'types.generated.ts'), symbolTypesCode, {encoding: 'utf8'});
  return generatedFiles;
}

export default generate;