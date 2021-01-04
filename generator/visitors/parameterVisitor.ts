import { NodeVisitorBase } from './nodeVisitor';
import { Node, ParameterDeclaration, SyntaxKind } from 'typescript';
import { GeneratorContext, ImportFrom, CodeAccessor } from '../generatorContext';
import { addUsedImports, getAccessorDeclaration, getSymbolName, toNamespace, tryFindImportType } from '../utils';
import * as path from 'path';

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

  private getConstructorArgType(node: ParameterDeclaration, context: GeneratorContext): CodeAccessor {
    if (!node.type) {
      throw Error(`The constructor argument ${node.name} has no type defined`);
    }

    const parameterAccessor = this.visitNext(node.type, context) as CodeAccessor;
    if (!parameterAccessor || !parameterAccessor.name) {
      throw Error(`Failed to find the constructor argument type`);
    }

    const usedImports: ImportFrom[] = [];
    const importType = addUsedImports(parameterAccessor, context.imports, usedImports)
    context.registrations.push({
      service: {
        accessor: parameterAccessor,
        importFrom: importType,
        displayName: getSymbolName(parameterAccessor, context.imports),
        symbolDescriptor: {
          symbolId: getSymbolName(parameterAccessor, usedImports),
          symbolNamespace: importType ? toNamespace(path.parse(importType.path).dir) : ''
        },
        accessorDeclaration: getAccessorDeclaration(parameterAccessor, context.imports)
      },
      instance: null,
      imports: null,
      scope: 'Transient'
    });

    return parameterAccessor;
  }
}