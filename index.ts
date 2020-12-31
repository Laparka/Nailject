import RegistrationsParser from './generator/registrationsParser';

const parser = new RegistrationsParser();
export const generate = (sourceFilePath: string, registrationClassName: string, outputDirectory: string): string[] => {
  const generatedFiles: string[] = [];
  const resolvers = parser.parse(sourceFilePath, registrationClassName);
  for(let i = 0; i < resolvers.length; i++) {
    const resolver = resolvers[i];
    parser.parseDependencies(resolver.instanceTypeNode);
  }

  return generatedFiles;
};