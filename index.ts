import RegistrationsParser from './generator/registrationsParser';
import { ImportFrom, RegistrationSymbol } from './generator/generatorContext';
import { Liquid } from 'liquidjs'
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const parser = new RegistrationsParser();
async function generate(filePath: string, className: string, outputDirectory: string): Promise<string[]> {
  const generatedFiles: string[] = [];
  const registrations = parser.parse(filePath, className);
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

    const codeContent = await liquid.renderFile('generator/templates/transientResolver.liquid', r);
    const prefix = r.scope[0].toLowerCase() + r.scope.substring(1, r.scope.length);
    const outputFile = [prefix, r.instance.displayName, r.service.displayName, 'ServiceResolver.ts'].join('Of');
    const outputFilePath = path.join(outputDirectory, outputFile);
    writeFileSync(outputFilePath, codeContent, {encoding: 'utf8'});
    generatedFiles.push(outputFilePath);
    const symbol = r.service.symbolDescriptor;
    if (allSymbols.findIndex(s => s.symbolId === symbol.symbolId && s.symbolNamespace == symbol.symbolNamespace) === -1) {
      allSymbols.push(symbol);
    }

    if (namespaces.findIndex(n => n === symbol.symbolNamespace) === -1) {
      namespaces.push(symbol.symbolNamespace);
    }
  }

  const codeContent = await liquid.renderFile('generator/templates/symbolTypes.liquid', {namespaces: namespaces, symbols: allSymbols});
  const typesFilePath = path.join(outputDirectory, 'types.generated.ts');
  writeFileSync(typesFilePath, codeContent, {encoding: 'utf8'});
  generatedFiles.push(typesFilePath);
  return generatedFiles;
}

export default generate;