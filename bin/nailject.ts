#!/usr/bin/env node

import commander from 'commander';
import { CommanderStatic } from 'commander';
import ServiceResolversGenerator from '../services/serviceResolversGenerator';

const program: CommanderStatic = commander;
program
  .version(require('../package.json').version)
  .usage('<filename> <outputDir> [options]')
  .parse(process.argv);

const options = {
  filename: program.args[0],
  outputDir: program.args[1]
};

console.log(`Launched via CLI: ${JSON.stringify(options)}`);
const generator = new ServiceResolversGenerator();
generator.generateServiceResolvers(options.filename, options.outputDir);