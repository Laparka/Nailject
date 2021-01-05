#!/usr/bin/env node

import commander from 'commander';
import { CommanderStatic } from 'commander';
import generate from '../';

const program: CommanderStatic = commander;
const usage = program
  .usage('<filename> [options]')
  .option('--moduleName <moduleName>', 'The class name that implements DependenciesRegistration interface name')
  .option('--outputDir <outputDir>', 'The output directory where the script writes all the generated files')
  .parse(process.argv);

console.log(usage.opts());
const options: any = usage.opts();
const fileName = usage.parse(process.argv).args[0];

console.log(`Launched via CLI: ${fileName} ${JSON.stringify(options)}`);

console.log(generate(fileName, options.moduleName, options.outputDir));
