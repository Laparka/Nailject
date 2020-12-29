#!/usr/bin/env node

import commander from 'commander';
import { CommanderStatic } from 'commander';
const ServiceResolversGenerator = require("../src/services/serviceResolversGenerator");

const program: CommanderStatic = commander;
program
  .version(require('../package.json').version)
  .usage('[options] <filename>')
  .parse(process.argv);

const options = {
  filename: program.args[0]
};

console.log(`Launched via CLI: ${JSON.stringify(options)}`);