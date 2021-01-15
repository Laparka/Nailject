#!/usr/bin/env node

import commander, { CommanderStatic } from 'commander';
import { FileCodeWriter } from '../renderer/codeWriter';
import { GeneratorParameters } from '../generator/generatorContext';
import { ScriptTarget } from 'typescript';
import RegistrationsParser from '../generator/registrationsParser';
import { CodeRenderer, LiquidCodeRenderer } from '../renderer/codeRenderer';

const program: CommanderStatic = commander;
const usage = program
  .usage('<filename> [options]')
  .requiredOption('--moduleName <moduleName>', 'The class name that implements DependenciesRegistration interface name')
  .requiredOption('--outputDir <outputDir>', 'The output directory where the script writes all the generated files')
  .option('--scriptTarget <scriptTarget>', 'TypeScript target: ES2017, ES2018, ES2019, ES2020')
  .parse(process.argv);

console.log(usage.opts());
const options: any = usage.opts();
const fileName = usage.parse(process.argv).args[0];

console.log(`Launched via CLI: ${fileName} ${JSON.stringify(options)}`);

let scriptTarget: ScriptTarget = ScriptTarget.ES2017;
if (options.scriptTarget) {
  scriptTarget = ScriptTarget[options.scriptTarget.toString() as keyof typeof ScriptTarget];
}

const parser = new RegistrationsParser();
const params: GeneratorParameters = {
  outputDirectory: options.outputDir,
  registrationClassName: options.moduleName,
  registrationFilePath: fileName,
  scriptTarget: scriptTarget
};

const registrations = parser.parse(params);
const codeWriter = new FileCodeWriter();
const renderer: CodeRenderer = new LiquidCodeRenderer(codeWriter);
const resolvers: string[] = [];
for(const r of registrations) {
  resolvers.push(renderer.renderResolver(r, params.outputDirectory));
}

console.log(resolvers);
console.log(renderer.renderServiceProvider(resolvers, params.outputDirectory));