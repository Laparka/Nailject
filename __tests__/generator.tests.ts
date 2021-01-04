import generate from '../index';

test("Must Generate Module Service Resolvers", () => {
  generate('./__tests__/module.ts', 'Module', '__tests__/.generated/');
});