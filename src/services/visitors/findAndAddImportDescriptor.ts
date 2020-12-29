import { GeneratorContext, ImportType } from '../../interfaces/generatorContext';

export default function(accessor: string[], context: GeneratorContext): ImportType {
  if (!accessor || accessor.length === 0){
    throw Error(`The accessor argument is required`)
  }

  if (!context) {
    throw Error(`Generator context argument is required`);
  }

  const keysIterator = context.import.keys();
  let next = keysIterator.next();
  let matchImport: [string, ImportType] | undefined;
  while(next && !next.done) {
    const imports = context.import.get(next.value)!;
    for(let i = 0; i < imports.length; i++) {
      const importDeclaration = imports[i];
      switch (importDeclaration.kind) {
        case "Default": {
          if (importDeclaration.name === accessor[0]) {
            matchImport = [next.value, importDeclaration];
          }

          break;
        }

        case "Named":
        case "Namespace": {
          if (importDeclaration.alias === accessor[0]) {
            matchImport = [next.value, importDeclaration];
          }

          break;
        }
      }

      if (matchImport) {
        break;
      }
    }

    if (matchImport) {
      break;
    }

    next = keysIterator.next();
  }

  if (!matchImport) {
    throw Error(`The ${accessor[0]}-type was not found in the imports`);
  }

  let usedImport = context.usedImports.get(matchImport[0]);
  if (!usedImport) {
    usedImport = [];
    context.usedImports.set(matchImport[0], usedImport);
  }

  if (usedImport.findIndex(x => matchImport && matchImport[1].name === x.name && matchImport[1].alias === x.alias) < 0) {
    usedImport.push(matchImport[1]);
  }

  return matchImport[1];
}