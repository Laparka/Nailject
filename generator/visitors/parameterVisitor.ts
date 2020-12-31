import { NodeVisitorBase } from './nodeVisitor';
import { Node, ParameterDeclaration, SyntaxKind } from 'typescript';
import { GeneratorContext, ImportType, NodeResult } from '../generatorContext';
import { addUsedImports, tryFindImportType } from '../utils';

export default class ParameterVisitor extends NodeVisitorBase<ParameterDeclaration> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.Parameter;
  }

  doVisit(node: ParameterDeclaration, context: GeneratorContext): NodeResult {
    if (context.mode === 'Module') {
      return this.getRegisterArgType(node, context);
    }

    if (context.mode === 'Dependent') {
      return this.getConstructorArgType(node, context);
    }

    throw Error(`The parameter declaration is not supported`)
  }

  private getRegisterArgType(node: ParameterDeclaration, context: GeneratorContext): NodeResult {
    if (!node.type) {
      throw Error(`The register-method argument parameter type is required`);
    }

    const nameTokens = this.visitNext(node.name, context);
    if (!nameTokens) {
      throw Error(`Invalid method-parameter name. Only register-method parameters are supported`)
    }

    const argumentName = nameTokens.name;
    const typeTokens = this.visitNext(node.type, context);
    if (!typeTokens) {
      throw Error(`The register argument ${argumentName} type was not recognized`);
    }

    const typeName = typeTokens.name;
    const typeAccessor = typeTokens.child;
    const importType = tryFindImportType(typeName, context.imports);
    if (!importType) {
      throw Error(`The register argument ${argumentName} type was not found in imports`);
    }

    if (importType.name !== 'ContainerBuilder' && importType.alias !== 'ContainerBuilder') {
      throw Error(`The register argument ${argumentName} must be of the ContainerBuilder-type`);
    }

    context.instanceName = argumentName;
    return {
      child: typeAccessor,
      name: argumentName,
      typeNames: []
    };
  }

  private getConstructorArgType(node: ParameterDeclaration, context: GeneratorContext): NodeResult {
    if (!node.type) {
      throw Error(`The constructor argument ${node.name} has no type defined`);
    }

    const argType = this.visitNext(node.type, context);
    if (!argType) {
      throw Error(`Failed to find the constructor argument type`);
    }

    const usedImports: ImportType[] = [];
    const argImport = addUsedImports(argType, context.imports, usedImports)
    context.resolvers.push({
      instanceTypeNode: {
        type: argType,
        path: argImport
      },
      scope: 'Transient',
      typeSymbolNode: argType,
      imports: context.imports,
      serviceTypeNode: argType
    })

    return argType;
  }
}