import { NodeVisitorBase } from './nodeVisitor';
import { CallExpression, Node, SyntaxKind } from 'typescript';
import {
  CodeAccessor,
  GeneratorContext,
  ImportFrom,
  InstanceDescriptor,
  RegistrationDescriptor,
  ServiceDescriptor,
} from '../generatorContext';
import { LifetimeScope } from '../../api/containerBuilder';
import { addUsedImports, getAccessorDeclaration, getSymbolName, toNamespace } from '../utils';
import * as path from 'path';

export default class CallExpressionVisitor extends NodeVisitorBase<CallExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.CallExpression;
  }

  doVisit(node: CallExpression, context: GeneratorContext): void {
    if (node.arguments.length !== 0 || !node.typeArguments || node.typeArguments.length !== 2) {
      return;
    }

    const methodCallAccessor = this.visitNext(node.expression, context) as CodeAccessor;
    if (!methodCallAccessor) {
      return;
    }

    const instanceName = methodCallAccessor.name;
    if (instanceName !== context.instanceName) {
      return;
    }

    if (!methodCallAccessor.child) {
      return;
    }

    let scope: LifetimeScope;
    switch (methodCallAccessor.child.name) {
      case 'addSingleton': {
        scope = 'Singleton';
        break;
      }

      case 'addTransient': {
        scope = 'Transient';
        break;
      }

      default: {
        throw new Error(`Not supported registration-method ${methodCallAccessor.child.name}`);
      }
    }

    const serviceCodeAccessor = this.visitNext(node.typeArguments[0], context) as CodeAccessor;
    if (!serviceCodeAccessor || !serviceCodeAccessor.name) {
      throw Error(`No service type argument is defined for the ${methodCallAccessor.child.name}-method`)
    }

    const usedImports: ImportFrom[] = [];
    const instanceCodeAccessor = this.visitNext(node.typeArguments[1], context) as CodeAccessor;
    if (!instanceCodeAccessor || !instanceCodeAccessor.name) {
      throw Error(`No instance type argument is defined for the ${methodCallAccessor.child.name}-method`)
    }

    const serviceImport = addUsedImports(serviceCodeAccessor, context.imports, usedImports);
    const serviceDescriptor: ServiceDescriptor = {
      symbolDescriptor: {
        symbolId: getSymbolName(serviceCodeAccessor, usedImports),
        symbolNamespace: serviceImport ? toNamespace(path.parse(serviceImport.path).dir) : ''
      },
      importFrom: serviceImport,
      displayName: getSymbolName(serviceCodeAccessor, usedImports),
      accessorDeclaration: getAccessorDeclaration(serviceCodeAccessor, usedImports),
      accessor: serviceCodeAccessor
    };

    const instanceDescriptor: InstanceDescriptor = {
      accessor: instanceCodeAccessor,
      constructorArgs: [],
      accessorDeclaration: getAccessorDeclaration(instanceCodeAccessor, usedImports),
      displayName: getSymbolName(instanceCodeAccessor, usedImports),
      importFrom: addUsedImports(instanceCodeAccessor, context.imports, usedImports),
      constructorType: CallExpressionVisitor.getConstructorType(instanceCodeAccessor, usedImports)
    };
    const registrationDescriptor: RegistrationDescriptor = {
      scope: scope,
      imports: usedImports,
      instance: instanceDescriptor,
      service: serviceDescriptor
    };

    context.registrations.push(registrationDescriptor);
  }

  private static getConstructorType(codeAccessor: CodeAccessor, imports: ImportFrom[]) {
    let name = codeAccessor.name;
    if (name === '[]') {
      if (codeAccessor.child) {
        return `${CallExpressionVisitor.getConstructorType(codeAccessor.child, imports)}[]`;
      }
    }

    if (codeAccessor.child) {
      name = `${name}.${CallExpressionVisitor.getConstructorType(codeAccessor.child, imports)}`;
    }

    return name;
  }
}