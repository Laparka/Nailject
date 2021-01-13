import { NodeVisitorBase } from './nodeVisitor';
import { CallExpression, Node, SyntaxKind } from 'typescript';
import {
  CodeAccessor,
  GeneratorContext,
  InstanceDescriptor,
  RegistrationDescriptor,
  ServiceDescriptor
} from '../generatorContext';
import { LifetimeScope } from '../../api/containerBuilder';
import { normalizeAccessor } from '../utils';

export default class CallExpressionVisitor extends NodeVisitorBase<CallExpression> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.CallExpression;
  }

  doVisit(node: CallExpression, context: GeneratorContext): void {
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

    if (!node.typeArguments || node.typeArguments.length !== 2) {
      throw Error(`The registration must include one service type and one instance type arguments`)
    }

    if (node.arguments.length !== 1) {
      throw Error(`The registration symbol argument is missing at the ${methodCallAccessor.child.name} registration method`);
    }

    const serviceTypeAccessor = this.visitNext(node.typeArguments[0], context) as CodeAccessor;
    if (!serviceTypeAccessor || !serviceTypeAccessor.name) {
      throw Error(`No service type argument is defined for the ${methodCallAccessor.child.name}-method`)
    }

    const instanceTypeAccessor = this.visitNext(node.typeArguments[1], context) as CodeAccessor;
    if (!instanceTypeAccessor || !instanceTypeAccessor.name) {
      throw Error(`No instance type argument is defined for the ${methodCallAccessor.child.name}-method`)
    }

    const argumentTypeAccessor = this.visitNext(node.arguments[0], context) as CodeAccessor;
    if (!argumentTypeAccessor) {
      throw Error(`Failed to parse the constructor argument type of ${instanceTypeAccessor.name} type. Reference declaration is required`)
    }

    normalizeAccessor(argumentTypeAccessor, context.imports);

    const serviceDescriptor: ServiceDescriptor = {
      symbolDescriptor: argumentTypeAccessor,
      accessor: serviceTypeAccessor
    };

    const instanceDescriptor: InstanceDescriptor = {
      accessor: instanceTypeAccessor,
      constructorArgs: []
    };

    const registrationDescriptor: RegistrationDescriptor = {
      scope: scope,
      instance: instanceDescriptor,
      service: serviceDescriptor
    };

    context.registrations.push(registrationDescriptor);
  }
}