import generate from '../index';
import { serviceProvider } from './.generated';
import { _interfaces } from './.generated/types.generated'

test("Must Generate Module Service Resolvers", () => {
  generate('./__tests__/module.ts', 'Module', '__tests__/.generated/');
});

test("Must Resolve", () => {
  const logger = serviceProvider.resolveOne(_interfaces.Logger);
  console.log(logger);
});