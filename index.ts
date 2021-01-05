import RegistrationsParser from './generator/registrationsParser';
import { RegistrationSymbol } from './generator/generatorContext';
import { Liquid } from 'liquidjs'
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { toImportFilter, toSymbolPath } from './generator/templates/filters';
import { resolverTemplate, serviceProviderTemplate, symbolsTemplate } from './generator/templates';

const liquid = new Liquid();
liquid.registerFilter('toImport', toImportFilter);
liquid.registerFilter('toSymbolPath', toSymbolPath);

const parser = new RegistrationsParser();
function generate(filePath: string, className: string, outputDirectory: string): string[] {
  const registrations = parser.parse(filePath, className);
  const allSymbols: RegistrationSymbol[] = [];
  const namespaces: string[] = [];
  const resolvers: string[] = [];
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  for (const r of registrations) {
    const resolverCode = liquid.parseAndRenderSync(resolverTemplate, {registration: r, outputDir: outputDirectory});
    const resolverName = [r.instance!.displayName, r.service.displayName, r.scope, 'ServiceResolver'].join('Of');
    const outputFile = resolverName[0].toLowerCase() + resolverName.substring(1, resolverName.length);
    writeFileSync(path.join(outputDirectory, `${outputFile}.ts`), resolverCode, {encoding: 'utf8'});
    const symbol = r.service.symbolDescriptor;
    if (allSymbols.findIndex(s => s.symbolId === symbol.symbolId && s.symbolNamespace === symbol.symbolNamespace) === -1) {
      allSymbols.push(symbol);
    }

    if (namespaces.findIndex(n => n === symbol.symbolNamespace) === -1) {
      namespaces.push(symbol.symbolNamespace);
    }

    resolvers.push(outputFile);
  }

  const symbolsCode = liquid.parseAndRenderSync(symbolsTemplate, {namespaces, symbols: allSymbols});
  const typesFilePath = path.join(outputDirectory, 'types.generated.ts');
  writeFileSync(typesFilePath, symbolsCode, {encoding: 'utf8'});

  const indexCode = liquid.parseAndRenderSync(serviceProviderTemplate, { resolvers: resolvers });
  const indexFilePath = path.join(outputDirectory, 'index.ts');
  writeFileSync(indexFilePath, indexCode, {encoding: 'utf8'});
  return resolvers;
}

export default generate;