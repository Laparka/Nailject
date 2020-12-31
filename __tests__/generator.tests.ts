import RegistrationsParser from '../generator/registrationsParser';

test("Must Generate Module Service Resolvers", () => {
  const generator = new RegistrationsParser();
  const resolvers = generator.parse('./__tests__/module.ts', 'Module');
  resolvers.forEach(value => {
    const args = generator.parseDependencies(value.instanceTypeNode);
    console.log(args);
  });
  console.log(resolvers);
});