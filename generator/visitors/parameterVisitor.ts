import { NodeVisitorBase } from './nodeVisitor';
import { Node, ParameterDeclaration, SyntaxKind } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
import { assignAccessorImport } from '../utils';

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

    const nameTokens = this.visitNext(node.name, context) as CodeAccessor;
    if (!nameTokens) {
      throw Error(`Invalid method-parameter name. Only register-method parameters are supported`)
    }

    const argumentName = nameTokens.name;
    const typeAccessor = this.visitNext(node.type, context) as CodeAccessor;
    if (!typeAccessor) {
      throw Error(`The register argument ${argumentName} type was not recognized`);
    }

    const typeImport = assignAccessorImport(typeAccessor, context.imports)
    if (!typeImport) {
      throw Error(`The register argument ${argumentName} type was not found in imports`);
    }

    if (typeImport.normalized.name !== typeImport.normalized.alias && typeImport.normalized.name !== 'ContainerBuilder') {
      throw Error(`The register argument ${argumentName} must be of the ContainerBuilder-type`);
    }

    context.instanceName = argumentName;
    return {
      child: typeAccessor,
      name: argumentName
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

    const argTypeImport = assignAccessorImport(argTypeAccessor, context.imports);
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