import { NodeVisitorBase } from './nodeVisitor';
import { Node, ParameterDeclaration, SyntaxKind } from 'typescript';
import { GeneratorContext } from '../generatorContext';
import { tryFindImportType } from '../utils';

export default class ParameterVisitor extends NodeVisitorBase<ParameterDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.Parameter;
  }

  doVisit(node: ParameterDeclaration, context: GeneratorContext): Map<string, string[]> {
    if (context.mode === 'Module') {
      return this.getRegisterArgType(node, context);
    }

    if (context.mode === 'Dependent') {
      return this.getConstructorArgType(node, context);
    }

    throw Error(`The parameter declaration is not supported`)
  }

  private getRegisterArgType(node: ParameterDeclaration, context: GeneratorContext): Map<string, string[]> {
    if (!node.type) {
      throw Error(`The register-method argument parameter type is required`);
    }

    const nameTokens = this.visitNext(node.name, context);
    if (!nameTokens || nameTokens.size !== 1) {
      throw Error(`Invalid method-parameter name. Only register-method parameters are supported`)
    }

    const argumentName = nameTokens.keys().next().value;
    const typeTokens = this.visitNext(node.type, context);
    if (!typeTokens || typeTokens.size !== 1) {
      throw Error(`The register argument ${argumentName} type was not recognized`);
    }

    const typeName = typeTokens.keys().next().value;
    const typeAccessor = typeTokens.get(typeName)!;
    const importType = tryFindImportType(typeName, context.imports);
    if (!importType) {
      throw Error(`The register argument ${argumentName} type was not found in imports`);
    }

    if (importType.name !== 'ContainerBuilder') {
      throw Error(`The register argument ${argumentName} must be of the ContainerBuilder-type`);
    }

    context.instanceName = argumentName;
    return new Map<string, string[]>([
      [argumentName, [[typeName, ...typeAccessor].join('.')]]
    ]);
  }

  private getConstructorArgType(node: ParameterDeclaration, context: GeneratorContext): Map<string, string[]> {
    throw Error(`Not implemented`);
  }
}