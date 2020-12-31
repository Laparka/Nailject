import RegistrationsParser from '../generator/registrationsParser';

test("Must Generate Module Service Resolvers", () => {
  const generator = new RegistrationsParser();
  const resolvers = generator.parse('./__tests__/module.ts', 'Module');
  console.log(resolvers);
});