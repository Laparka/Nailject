import RegistrationsParser from './generator/registrationsParser';
import { ImportFrom, RegistrationSymbol } from './generator/generatorContext';
import { Liquid } from 'liquidjs'
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

type ResolverName = {
  fileName: string;
  className: string;
  symbol: RegistrationSymbol;
};

const parser = new RegistrationsParser();
function generate(filePath: string, className: string, outputDirectory: string): string[] {
  const registrations = parser.parse(filePath, className);
  const allSymbols: RegistrationSymbol[] = [];
  const namespaces: string[] = [];
  const resolvers: ResolverName[] = [];

  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  const liquid = new Liquid();
  for (const r of registrations) {
    const imports: ImportFrom[] = [];
    for(const i of r.imports!) {
      const copiedImport: ImportFrom = {
        isExternal: i.isExternal,
        relativePath: i.relativePath,
        path: i.path,
        name: i.name,
        alias: i.alias,
        kind: i.kind
      };

      if (!i.isExternal) {
        const importPath = path.join(i.relativePath, i.path)
        copiedImport.path = path.relative(outputDirectory, importPath).replace(/[\\]/g, '/');
        copiedImport.relativePath = outputDirectory;
      }

      imports.push(copiedImport);
    }

    r.imports = imports;
    const resolverCode = liquid.renderFileSync('generator/templates/resolver.liquid', r);
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

    resolvers.push({
      fileName: outputFile,
      className: resolverName,
      symbol: symbol
    });
  }

  const symbolsCode = liquid.renderFileSync('generator/templates/symbolTypes.liquid', {namespaces, symbols: allSymbols});
  const typesFilePath = path.join(outputDirectory, 'types.generated.ts');
  writeFileSync(typesFilePath, symbolsCode, {encoding: 'utf8'});

  const indexCode = liquid.renderFileSync('generator/templates/index.liquid', { symbols: allSymbols, resolvers: resolvers });
  const indexFilePath = path.join(outputDirectory, 'index.ts');
  writeFileSync(indexFilePath, indexCode, {encoding: 'utf8'});
  return resolvers.map(r => `${r.fileName}.ts`);
}

export default generate;