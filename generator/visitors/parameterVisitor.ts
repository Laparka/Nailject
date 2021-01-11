import { NodeVisitorBase } from './nodeVisitor';
import { Node, ParameterDeclaration, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
import { getNormalizedImport, tryFindImportByAccessor } from '../utils';

export default class ParameterVisitor extends NodeVisitorBase<ParameterDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.Parameter;
  }

  doVisit(node: ParameterDeclaration, context: GeneratorContext): CodeAccessor {
    if (context.mode === 'Module') {
      return this.getRegisterArgType(node, context);
    }

    if (context.mode === 'Dependent') {
      return this.getConstructorArgType(node, context);
    }

    throw Error(`The parameter declaration is not supported`)
  }

  private getRegisterArgType(node: ParameterDeclaration, context: GeneratorContext): CodeAccessor {
    if (!node.type) {
      throw Error(`The register-method argument parameter type is required`);
    }

    const objectCallerName = this.visitNext(node.name, context) as CodeAccessor;
    if (!objectCallerName) {
      throw Error(`Failed to parse the method-object callee-instance name.`)
    }

    const containerBuilderInstanceName = objectCallerName.name;
    const typeAccessor = this.visitNext(node.type, context) as CodeAccessor;
    if (!typeAccessor) {
      throw Error(`The register argument ${containerBuilderInstanceName} type was not recognized`);
    }

    const containerBuilderImport = tryFindImportByAccessor(typeAccessor, context.imports)
    if (!containerBuilderImport) {
      throw Error(`The register argument ${containerBuilderInstanceName} type was not found in imports`);
    }

    typeAccessor.importFrom = containerBuilderImport;
    const normalized = getNormalizedImport(typeAccessor);
    if (!normalized || normalized.name !== 'ContainerBuilder') {
      throw Error(`The register argument ${containerBuilderInstanceName} must be of the ContainerBuilder-type`);
    }

    context.instanceName = containerBuilderInstanceName;
    return {
      child: typeAccessor,
      name: containerBuilderInstanceName
    };
  }

  private getConstructorArgType(node: ParameterDeclaration, context: GeneratorContext): CodeAccessor {
    if (!node.type) {
      throw Error(`The constructor argument ${node.name} has no type defined`);
    }

    const argTypeAccessor = this.visitNext(node.type, context) as CodeAccessor;
    if (!argTypeAccessor || !argTypeAccessor.name) {
      throw Error(`Failed to find the constructor argument type`);
    }

    const argTypeImport = tryFindImportByAccessor(argTypeAccessor, context.imports);
    if (!argTypeImport) {
      throw Error(`Failed to find the constructor argument type in imports: ${argTypeAccessor.name}`);
    }

    context.registrations.push({
      service: {
        accessor: argTypeAccessor
      },
      scope: 'Transient'
    });

    return argTypeAccessor;
  }
}