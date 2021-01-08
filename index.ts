import RegistrationsParser from './generator/registrationsParser';
import { GeneratorParameters } from './generator/generatorContext';
import { Liquid } from 'liquidjs'
import * as path from 'path';
import { toImportFilter, toSymbolPath } from './generator/templates/filters';
import { CodeWriter } from './renderer/codeWriter';
import { ResolversRenderer } from './renderer/resolversRenderer';

const templateDir = path.join(__dirname, 'generator', 'templates');
const resolverTemplatePath = path.join(templateDir, 'resolver.liquid');
const symbolTypesTemplatePath = path.join(templateDir, 'types.liquid');
const serviceProviderTemplatePath = path.join(templateDir, 'serviceProvider.liquid');

const liquid = new Liquid();
liquid.registerFilter('toImport', toImportFilter);
liquid.registerFilter('toSymbolPath', toSymbolPath);

const parser = new RegistrationsParser();
export class IoCGenerator {
  private readonly _resolversRenderer: ResolversRenderer;
  private readonly _writer: CodeWriter;
  constructor(writer: CodeWriter) {
    this._writer = writer;
    this._resolversRenderer = new ResolversRenderer(this._writer);
  }

  generate(parameters: GeneratorParameters): string[] {
    if (!parameters || !parameters.registrationFilePath) {
      throw Error(`The source registration file path is required`);
    }

    if (!parameters.registrationClassName) {
      throw Error(`The source registration class name is required`);
    }

    if (!parameters.outputDirectory) {
      throw Error(`The output directory path is required`)
    }

    const registrations = parser.parse(parameters);
    this._resolversRenderer.render(registrations);
    const allSymbols: string[] = [];
    const namespaces: string[] = [];
    const resolvers: string[] = [];
    for (const r of registrations) {
      const resolverName = "test";
      const outputFile = resolverName[0].toLowerCase() + resolverName.substring(1, resolverName.length);
      this.renderToOutput(parameters, `${outputFile}.ts`, resolverTemplatePath,{
        registration: r,
        outputDir: parameters.outputDirectory
      });

      resolvers.push(outputFile);
    }

    this.renderToOutput(parameters, "types.generated.ts", symbolTypesTemplatePath, {namespaces, symbols: allSymbols});
    this.renderToOutput(parameters, "index.ts", serviceProviderTemplatePath, { resolvers: resolvers});
    return resolvers;
  }

  private renderToOutput(parameters: GeneratorParameters, outputFile: string, templatePath: string, renderModel: any) {
    const filePath = path.join(parameters.outputDirectory, outputFile);
    const content = liquid.renderFileSync(templatePath, renderModel);
    this._writer.write(filePath, content);
  }
}