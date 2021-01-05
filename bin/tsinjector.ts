#!/usr/bin/env node

import commander from 'commander';
import { CommanderStatic } from 'commander';
import generate from '../';

const program: CommanderStatic = commander;
program
  .usage('<filename> <moduleName> <outputDir> [options]')
  .parse(process.argv);

const options = {
  filename: program.args[0],
  moduleName: program.args[1],
  outputDir: program.args[2]
};
console.log(`Launched via CLI: ${JSON.stringify(options)}`);

generate(options.filename, 'Module', options.outputDir);
