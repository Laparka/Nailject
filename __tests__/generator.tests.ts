import ServiceResolversGenerator from '../generator/serviceResolversGenerator';

test("Must Generate Module Service Resolvers", () => {
  const generator = new ServiceResolversGenerator();
  const resolvers = generator.generate('./__tests__/module.ts', 'Module');
  console.log(resolvers);
});