import ServiceResolversGenerator from '../generator/serviceResolversGenerator';

test("Must Generate Module Service Resolvers", () => {
  const generator = new ServiceResolversGenerator();
  const fileContents = generator.generate('./__tests__/module.ts', 'Module');
});