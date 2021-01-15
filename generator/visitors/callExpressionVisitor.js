"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
class CallExpressionVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.CallExpression;
    }
    doVisit(node, context) {
        const methodCallAccessor = this.visitNext(node.expression, context);
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
        let scope;
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
            throw Error(`The registration must include one service type and one instance type arguments`);
        }
        if (node.arguments.length !== 1) {
            throw Error(`The registration symbol argument is missing at the ${methodCallAccessor.child.name} registration method`);
        }
        const serviceTypeAccessor = this.visitNext(node.typeArguments[0], context);
        if (!serviceTypeAccessor || !serviceTypeAccessor.name) {
            throw Error(`No service type argument is defined for the ${methodCallAccessor.child.name}-method`);
        }
        const instanceTypeAccessor = this.visitNext(node.typeArguments[1], context);
        if (!instanceTypeAccessor || !instanceTypeAccessor.name) {
            throw Error(`No instance type argument is defined for the ${methodCallAccessor.child.name}-method`);
        }
        const argumentTypeAccessor = this.visitNext(node.arguments[0], context);
        if (!argumentTypeAccessor) {
            throw Error(`Failed to parse the constructor argument type of ${instanceTypeAccessor.name} type. Reference declaration is required`);
        }
        utils_1.normalizeAccessor(argumentTypeAccessor, context.imports);
        const serviceDescriptor = {
            symbolDescriptor: argumentTypeAccessor,
            accessor: serviceTypeAccessor
        };
        const instanceDescriptor = {
            accessor: instanceTypeAccessor,
            constructorArgs: []
        };
        const registrationDescriptor = {
            scope: scope,
            instance: instanceDescriptor,
            service: serviceDescriptor
        };
        context.registrations.push(registrationDescriptor);
    }
}
exports.default = CallExpressionVisitor;
