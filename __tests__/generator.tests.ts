import RegistrationsParser from '../generator/registrationsParser';

test("Must Generate Module Service Resolvers", () => {
  const generator = new RegistrationsParser();
  const resolvers = generator.parse('./__tests__/module.ts', 'Module');
  resolvers.forEach(value => {
    console.log(value);
    const dependencyTypes = generator.parseDependencies(value.instanceTypeNode);
    console.log(dependencyTypes);
  });
  console.log(resolvers);
});