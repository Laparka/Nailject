#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const codeWriter_1 = require("../renderer/codeWriter");
const typescript_1 = require("typescript");
const registrationsParser_1 = __importDefault(require("../generator/registrationsParser"));
const codeRenderer_1 = require("../renderer/codeRenderer");
const program = commander_1.default;
const usage = program
    .usage('<filename> [options]')
    .requiredOption('--moduleName <moduleName>', 'The class name that implements DependenciesRegistration interface name')
    .requiredOption('--outputDir <outputDir>', 'The output directory where the script writes all the generated files')
    .option('--scriptTarget <scriptTarget>', 'TypeScript target: ES2017, ES2018, ES2019, ES2020')
    .parse(process.argv);
console.log(usage.opts());
const options = usage.opts();
const fileName = usage.parse(process.argv).args[0];
console.log(`Launched via CLI: ${fileName} ${JSON.stringify(options)}`);
let scriptTarget = typescript_1.ScriptTarget.ES2017;
if (options.scriptTarget) {
    scriptTarget = typescript_1.ScriptTarget[options.scriptTarget.toString()];
}
const parser = new registrationsParser_1.default();
const params = {
    outputDirectory: options.outputDir,
    registrationClassName: options.moduleName,
    registrationFilePath: fileName,
    scriptTarget: scriptTarget
};
const registrations = parser.parse(params);
const codeWriter = new codeWriter_1.FileCodeWriter();
const renderer = new codeRenderer_1.LiquidCodeRenderer(codeWriter);
const resolvers = [];
for (const r of registrations) {
    resolvers.push(renderer.renderResolver(r, params.outputDirectory));
}
console.log(resolvers);
console.log(renderer.renderServiceProvider(resolvers, params.outputDirectory));
