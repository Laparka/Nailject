import { CallExpression, MemberExpression } from '@typescript-eslint/types/dist/ts-estree';
import ExpressionVisitorBase from './expressionVisitorBase';
import { AST_NODE_TYPES } from '@typescript-eslint/types/dist/ast-node-types';
import { DependencyDescriptor, GeneratorContext, ImportType } from '../../interfaces/generatorContext';
import Expression from '../../interfaces/expression';
import { FilePathNode } from './filePathDeclarationVisitor';
import { LifetimeScope } from '../../interfaces/lifetimeScope';

export default class CallExpressionVisitor extends ExpressionVisitorBase<CallExpression> {
  canVisit(expression: Expression): boolean {
    return expression.type === AST_NODE_TYPES.CallExpression;
  }

  visitExpression(expression: CallExpression, context: GeneratorContext): string[] {
    const result: string[] = [];
    if (expression.callee.type !== AST_NODE_TYPES.MemberExpression) {
      return result;
    }

    if (!expression.typeParameters || expression.typeParameters.params.length !== 2) {
      return result;
    }

    if (expression.arguments.length !== 0) {
      return result;
    }

    const callee = expression.callee as MemberExpression;
    const calleeName = this.rootVisitor.visit(callee.object, context) as string[];
    if (!calleeName || calleeName.length === 0 || calleeName[calleeName.length - 1] !== context.instanceName) {
      return result;
    }

    const methodName = this.rootVisitor.visit(callee.property, context) as string[];
    if (!methodName || methodName.length !== 1) {
      return result;
    }

    const registrationCtx: GeneratorContext = {
      usedImports: new Map<string, ImportType[]>(),
      instanceName: context.instanceName,
      import: context.import,
      mode: 'Generating',
      modulePath: "",
      registrations: undefined
    };

    const serviceTypeName = this.rootVisitor.visit(expression.typeParameters.params[0], registrationCtx);
    const instanceTypeName = this.rootVisitor.visit(expression.typeParameters.params[1], registrationCtx);

    registrationCtx.modulePath = CallExpressionVisitor.findImportTypePath(instanceTypeName, registrationCtx.usedImports);
    registrationCtx.instanceName = instanceTypeName[0];
    const fileNode = new FilePathNode(registrationCtx.modulePath, 'Generating');
    let scope: LifetimeScope;
    switch (methodName[0]) {
      case 'addSingleton': {
        scope = 'Singleton';
        break;
      }

      case 'addTransient': {
        scope = 'Transient';
        break;
      }

      default: {
        throw Error(`Not supported method call name ${methodName[0]}`);
      }
    }

    const constructorArgs = this.rootVisitor.visit(fileNode, registrationCtx);
    if (!context.registrations) {
      context.registrations = new Map<LifetimeScope, DependencyDescriptor[]>()
    }

    let registrations = context.registrations.get(scope);
    if (!registrations) {
      registrations = [];
      context.registrations.set(scope, registrations);
    }

    registrations.push({
      dependencies: constructorArgs,
      serviceType: serviceTypeName,
      instanceType: instanceTypeName,
      imports: registrationCtx.usedImports
    });

    return result;
  }

  private static findImportTypePath(instanceTypeName: string[], usedImports: Map<string, ImportType[]>): string {
    const typeName = instanceTypeName[0].split(/[.]/g)[0];
    const keyIterator = usedImports.keys();
    let next;
    do {
      next = keyIterator.next();
      if(!next || !next.value) {
        break;
      }

      const imports = usedImports.get(next.value)!;
      for(let i = 0; i < imports.length; i++) {
        if (imports[i].name === typeName || imports[i].alias === typeName) {
          return next.value;
        }
      }
    }while(next && !next.done)

    throw Error(`Failed to find the imported type ${instanceTypeName.join('.')}`);
  }
}