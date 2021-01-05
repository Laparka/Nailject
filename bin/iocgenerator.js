#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const __1 = __importDefault(require("../"));
const program = commander_1.default;
const usage = program
    .usage('<filename> [options]')
    .option('--moduleName <moduleName>', 'The class name that implements DependenciesRegistration interface name')
    .option('--outputDir <outputDir>', 'The output directory where the script writes all the generated files')
    .parse(process.argv);
console.log(usage.opts());
const options = usage.opts();
const fileName = usage.parse(process.argv).args[0];
console.log(`Launched via CLI: ${fileName} ${JSON.stringify(options)}`);
console.log(__1.default(fileName, options.moduleName, options.outputDir));
